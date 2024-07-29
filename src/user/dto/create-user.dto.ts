import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
