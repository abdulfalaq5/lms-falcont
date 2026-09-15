import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export enum QuizType {
  PILIHAN_GANDA = 'pilihan_ganda',
  ESSAY = 'essay',
}

export class CreateQuizDto {
  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: QuizType })
  @IsEnum(QuizType)
  type: QuizType;
}
