import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';  
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from 'src/users/user.login';
import { ProtectedController } from './auth.controller'; 
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    UsersModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:  process.env.JWT_SECRET,  
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],  
  controllers: [AuthController, ProtectedController],  
  exports: [AuthService],
})
export class AuthModule {}
