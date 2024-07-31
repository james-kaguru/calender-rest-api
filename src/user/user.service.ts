import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await argon.hash(createUserDto.password);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        hash,
        email: createUserDto.email,
      },
    });
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}
