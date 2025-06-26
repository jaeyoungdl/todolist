import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('🔥 로그인 요청 받음:', { email: loginDto.email, passwordLength: loginDto.password?.length });
    
    try {
      const result = await this.authService.login(loginDto);
      console.log('✅ 로그인 성공:', { userId: result.user.id, email: result.user.email });
      return result;
    } catch (error) {
      console.error('❌ 로그인 실패:', error.message);
      throw error;
    }
  }
} 