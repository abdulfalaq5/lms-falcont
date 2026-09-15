import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UpsertGradeDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  final_score?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  certificate_issued?: boolean;
}
