import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SubmitQuizDto {
  @ApiProperty({
    description: 'Map question_id -> jawaban',
    example: { 'question-uuid-1': '<p>', 'question-uuid-2': 'Jawaban essay...' },
  })
  @IsObject()
  answers: Record<string, string>;
}
