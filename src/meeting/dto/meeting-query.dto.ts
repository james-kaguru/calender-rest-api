import { IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { dateParser } from '../../utils/date-parser';

export class MeetingQueryDto {
  @IsDateString()
  @IsOptional()
  @Transform(dateParser)
  date?: string;
}
