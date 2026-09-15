import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class GradeSubmissionDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}
