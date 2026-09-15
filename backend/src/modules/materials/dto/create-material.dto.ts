import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export enum MaterialType {
  VIDEO = 'video',
  DOCUMENT = 'document',
  LINK = 'link',
}

export class CreateMaterialDto {
  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: MaterialType })
  @IsEnum(MaterialType)
  type: MaterialType;

  @ApiProperty()
  @IsString()
  content_url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}
