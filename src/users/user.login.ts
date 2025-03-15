import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { loginDto } from 'src/validators/login.validator'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  
  @Post('login')
  async login(@Body() loginDto: loginDto) {
    console.log('Login request:', loginDto); // Debug uchun
  
    const identifier = loginDto.username || loginDto.email;
    const password = loginDto.password;
  
    if (!identifier || !password) {
      throw new HttpException('Username/email va parol kerak!', HttpStatus.BAD_REQUEST);
    }
  
    const user = await this.usersService.findByUsernameOrEmail(identifier);
    if (!user) {
      throw new HttpException('Invalid username or email', HttpStatus.NOT_FOUND);
    }
  
    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
  
    const payload = { id: user.id, nickname: user.username, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return { access_token: token };
  }
  
}