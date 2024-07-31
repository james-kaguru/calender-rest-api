import { Injectable } from '@nestjs/common';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MeetingQueryDto } from './dto/meeting-query.dto';
import { DateTime } from 'luxon';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.MeetingUncheckedCreateInput) {
    return this.prisma.meeting.create({ data });
  }

  async checkAvailability(userId: number, from: string, to: string) {
    const meetings = await this.prisma.meeting.findMany({
      where: {
        from,
        to: {
          lte: to,
        },
        userId,
      },
    });

    return meetings.length <= 0;
  }

  findAll(userId: number, query: MeetingQueryDto) {
    const where: Prisma.MeetingWhereInput = {
      userId,
    };

    if (query.date) {
      const date = DateTime.fromISO(query.date);
      const dateStart = date.startOf('day').toString();
      const dateEnd = date.endOf('day').toString();
      where.AND = [
        {
          from: {
            gte: dateStart,
          },
        },
        {
          from: {
            lte: dateEnd,
          },
        },
      ];
    }

    return this.prisma.meeting.findMany({
      where,
      orderBy: {
        from: 'asc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
