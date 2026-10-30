import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { algorithm: 'HS256', expiresIn: config.getOrThrow<number>('JWT_TTL_SECONDS'), issuer: 'drainmaster-api', audience: 'drainmaster-web' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, AuthGuard, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
