import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubmitAssignmentDto {
  @ApiProperty()
  @IsString()
  file_url: string;
}
