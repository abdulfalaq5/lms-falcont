import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AttendanceEntryDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty({ enum: ['hadir', 'izin', 'alpha'] })
  @IsIn(['hadir', 'izin', 'alpha'])
  status: 'hadir' | 'izin' | 'alpha';
}

export class RecordAttendanceDto {
  @ApiProperty({ type: [AttendanceEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntryDto)
  entries: AttendanceEntryDto[];
}
