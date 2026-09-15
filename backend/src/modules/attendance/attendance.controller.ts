import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';
import { RecordAttendanceDto } from './dto/record-attendance.dto';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('schedule/:scheduleId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  findBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.attendanceService.findBySchedule(scheduleId);
  }

  @Post('schedule/:scheduleId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  record(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: RecordAttendanceDto,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.attendanceService.record(scheduleId, dto, actor);
  }
}
