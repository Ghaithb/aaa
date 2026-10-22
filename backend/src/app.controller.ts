import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { RegisterDto } from './auth/dto/register.dto';
import { LoginDto } from './auth/dto/login.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    return req.user;
  }
}
