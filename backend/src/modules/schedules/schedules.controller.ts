import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('calendar')
  calendar(@CurrentUser() actor: AuthUser) {
    return this.schedulesService.calendarFor(actor);
  }

  @Get()
  @ApiQuery({ name: 'courseId', required: true })
  findByCourse(@Query('courseId') courseId: string) {
    return this.schedulesService.findByCourse(courseId);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  create(@Body() dto: CreateScheduleDto, @CurrentUser() actor: AuthUser) {
    return this.schedulesService.create(dto, actor);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto, @CurrentUser() actor: AuthUser) {
    return this.schedulesService.update(id, dto, actor);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthUser) {
    return this.schedulesService.remove(id, actor);
  }
}
