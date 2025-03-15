import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class loginDto {
  @IsNotEmpty()
  @IsString()
  username?: string; // username bo‘lishi mumkin

  @IsNotEmpty()
  @IsString()
  email?: string; // email bo‘lishi mumkin

  @IsNotEmpty()
  @IsString()
  password: string;
}