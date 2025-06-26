import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 사용자 검증 시작:', { email, passwordLength: password.length });
    
    const user = await this.usersService.findByEmail(email);
    console.log('🔍 DB에서 찾은 사용자:', user ? { id: user.id, email: user.email, hasPassword: !!user.password, passwordLength: user.password?.length } : 'null');
    
    if (user) {
      console.log('🔍 비밀번호 비교 시작...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🔍 비밀번호 비교 결과:', isPasswordValid);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        console.log('✅ 로그인 성공:', { id: result.id, email: result.email });
        return result;
      } else {
        console.log('❌ 비밀번호 불일치');
      }
    } else {
      console.log('❌ 사용자를 찾을 수 없음');
    }
    
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload = { email: user.email, sub: user.id };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
} 