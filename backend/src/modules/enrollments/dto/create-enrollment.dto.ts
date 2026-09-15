import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsUUID()
  course_id: string;
}
