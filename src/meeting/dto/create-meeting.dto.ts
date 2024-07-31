import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { dateParser } from '../../utils/date-parser';

export class CreateMeetingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  description: string;

  @IsDateString()
  @Transform(dateParser)
  from: string;

  @IsDateString()
  @Transform(dateParser)
  to: string;
}
