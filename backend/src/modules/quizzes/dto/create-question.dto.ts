import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { QuizType } from './create-quiz.dto';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  question_text: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correct_answer?: string;

  @ApiProperty({ enum: QuizType })
  @IsEnum(QuizType)
  type: QuizType;
}
