import { IsString } from 'class-validator';

export class LoginWithEmailDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
