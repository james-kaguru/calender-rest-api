import { Injectable, NotFoundException } from '@nestjs/common';
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

  async checkAvailability(
    userId: number,
    from: string,
    to: string,
    meetingId?: number,
  ) {
    const meetings = await this.prisma.meeting.findMany({
      where: {
        id: meetingId !== undefined ? { not: meetingId } : {},
        from: {
          lte: to,
        },
        to: {
          gte: from,
        },
        userId,
      },
    });

    return { isAvailable: meetings.length <= 0, meetings };
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

  async findOne(id: number, userId: number) {
    const meeting = await this.prisma.meeting.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!meeting)
      throw new NotFoundException(`Meeting ${meeting.id} not found`);
    return meeting;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto, userId: number) {
    return this.prisma.meeting.update({
      where: {
        userId,
        id,
      },
      data: updateMeetingDto,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.meeting.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
