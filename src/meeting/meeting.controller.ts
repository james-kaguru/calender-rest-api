import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AuthGuard } from '../auth/auth.guard';
import { DateTime } from 'luxon';
import { RequestWithUser } from '../auth/auth.interfaces';
import { MeetingQueryDto } from './dto/meeting-query.dto';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createMeetingDto: CreateMeetingDto,
    @Req() req: RequestWithUser,
  ) {
    const { isAvailable, meetings } =
      await this.meetingService.checkAvailability(
        req.user.sub,
        createMeetingDto.from,
        createMeetingDto.to,
      );

    if (!isAvailable) {
      throw new BadRequestException({
        message: 'Meeting time is not available',
        meetings,
      });
    }

    return this.meetingService.create({
      userId: req.user.sub,
      title: createMeetingDto.title,
      description: createMeetingDto.title,
      from: createMeetingDto.from,
      to: createMeetingDto.to,
      createdAt: DateTime.now().toISO(),
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: RequestWithUser, @Query() query: MeetingQueryDto) {
    return this.meetingService.findAll(req.user.sub, query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.meetingService.findOne(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @Req() req: RequestWithUser,
  ) {
    await this.meetingService.findOne(+id, req.user.sub);

    const { isAvailable, meetings } =
      await this.meetingService.checkAvailability(
        req.user.sub,
        updateMeetingDto.from,
        updateMeetingDto.to,
        +id,
      );

    if (!isAvailable) {
      throw new BadRequestException({
        message: 'Meeting time is not available',
        meetings,
      });
    }

    return this.meetingService.update(+id, updateMeetingDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.meetingService.findOne(+id, req.user.sub);

    return this.meetingService.remove(+id, req.user.sub);
  }
}
