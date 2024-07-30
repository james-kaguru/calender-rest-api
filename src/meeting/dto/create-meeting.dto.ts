import { IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { dateParser } from '../../utils/date-parser';

export class CreateMeetingDto {
  @IsDateString()
  @Transform(dateParser)
  from: string;

  @IsDateString()
  @Transform(dateParser)
  to: string;
}
