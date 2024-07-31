import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user) throw new BadRequestException('Invalid credentials');

    if (user.hash !== password)
      throw new BadRequestException('Invalid credentials');

    const payload = { sub: user.id, username: user.name };

    const secret = this.configService.get('JWT_SECRET');

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret,
    });

    return {
      accessToken,
    };
  }

  // async signUp(email: string, password: string): Promise<any> {
  //   const user = await this.userService.findOne(username);
  //   if (user?.hash !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //   const { password, ...result } = user;
  //   // TODO: Generate a JWT and return it here
  //   // instead of the user object
  //   return result;
  // }
}
