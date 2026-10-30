import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export type AuthRequest = Request & { userId: string };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const match = /^Bearer ([^\s]+)$/i.exec(request.headers.authorization ?? '');
    if (!match) throw new UnauthorizedException();
    try {
      const payload = await this.jwt.verifyAsync(match[1], { algorithms: ['HS256'], issuer: 'drainmaster-api', audience: 'drainmaster-web' });
      if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') throw new Error();
      request.userId = payload.sub;
      return true;
    } catch { throw new UnauthorizedException(); }
  }
}
