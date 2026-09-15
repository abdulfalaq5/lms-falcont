import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.enrollmentsService.findAll(status);
  }

  @Get('me')
  @Roles(Role.USER)
  findMine(@CurrentUser() user: AuthUser) {
    return this.enrollmentsService.findByUser(user.sub);
  }

  @Get('course/:courseId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  findByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Post()
  @Roles(Role.USER)
  enroll(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentsService.enroll(user.sub, dto);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentStatusDto,
    @CurrentUser() actor: AuthUser,
  ) {
    const enrollment = await this.enrollmentsService.updateStatus(id, dto.status);
    await this.auditLogsService.record(actor.sub, 'update_status', 'enrollments', id);
    return enrollment;
  }
}
