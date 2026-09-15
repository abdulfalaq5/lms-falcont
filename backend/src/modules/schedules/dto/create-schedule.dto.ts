import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum ScheduleType {
  SESSION = 'session',
  DEADLINE = 'deadline',
}

export class CreateScheduleDto {
  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ScheduleType })
  @IsEnum(ScheduleType)
  type: ScheduleType;

  @ApiProperty()
  @IsDateString()
  start_time: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  end_time?: string;
}
