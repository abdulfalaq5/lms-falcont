import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateEnrollmentStatusDto {
  @ApiProperty({ enum: ['pending', 'approved', 'active', 'completed', 'dropped'] })
  @IsIn(['pending', 'approved', 'active', 'completed', 'dropped'])
  status: 'pending' | 'approved' | 'active' | 'completed' | 'dropped';
}
