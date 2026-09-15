import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GradeAssignmentDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  grade: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedback?: string;
}
