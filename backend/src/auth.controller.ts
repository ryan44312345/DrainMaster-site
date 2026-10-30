import { Body, Controller, Get, Header, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthGuard, type AuthRequest } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Header('Cache-Control', 'no-store')
  register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Header('Cache-Control', 'no-store')
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Get('me')
  @UseGuards(AuthGuard)
  @Header('Cache-Control', 'no-store')
  me(@Req() request: AuthRequest) { return this.auth.me(request.userId); }
}
