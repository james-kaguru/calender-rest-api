import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signToken(payload: { sub: number; username: string }) {
    const secret = this.configService.get('JWT_SECRET');

    return await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret,
    });
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user) throw new BadRequestException('Invalid credentials');

    const pwdMatches = await argon.verify(user.hash, password);

    if (!pwdMatches) throw new BadRequestException('Invalid credentials');

    const accessToken = await this.signToken({
      sub: user.id,
      username: user.name,
    });
    return {
      accessToken,
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const accessToken = await this.signToken({
      sub: user.id,
      username: user.name,
    });

    return {
      accessToken,
    };
  }
}
