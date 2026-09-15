import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiPropertyOptional({ description: 'Kosongkan untuk pengumuman global' })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;
}
