import { ConflictException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import * as argon2 from 'argon2';
import { Prisma } from './generated/prisma/client';
import { PrismaService } from './prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';

const safeUser = { id: true, name: true, email: true, createdAt: true } as const;
const hashOptions = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

@Injectable()
export class AuthService implements OnModuleInit {
  private dummyHash!: string;
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async onModuleInit() {
    this.dummyHash = await argon2.hash(randomBytes(32), hashOptions);
  }

  async register(dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password, hashOptions);
    try {
      return await this.prisma.user.create({
        data: { name: dto.name, email: dto.email, passwordHash }, select: safeUser,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Nao foi possivel cadastrar com os dados informados.');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const valid = await argon2.verify(user?.passwordHash ?? this.dummyHash, dto.password);
    if (!user || !valid) throw new UnauthorizedException('E-mail ou senha invalidos.');
    return {
      access_token: await this.jwt.signAsync({ sub: user.id }),
      token_type: 'Bearer',
      expires_in: this.config.getOrThrow<number>('JWT_TTL_SECONDS'),
    };
  }

  async me(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: safeUser });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
