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
    @Req() request: RequestWithUser,
  ) {
    const user = request.user;
    const userId = parseInt(user.sub);

    const isAvailable = await this.meetingService.checkAvailability(
      userId,
      createMeetingDto.from,
      createMeetingDto.to,
    );

    if (!isAvailable)
      throw new BadRequestException('Meeting time is not available');

    return this.meetingService.create({
      userId,
      from: createMeetingDto.from,
      to: createMeetingDto.to,
      createdAt: DateTime.now().toISO(),
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: RequestWithUser, @Query() query: MeetingQueryDto) {
    const user = request.user;
    const userId = parseInt(user.sub);

    return this.meetingService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.update(+id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(+id);
  }
}
