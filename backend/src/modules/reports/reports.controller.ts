import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { UpsertGradeDto } from './dto/upsert-grade.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('me')
  @Roles(Role.USER)
  findMine(@CurrentUser() user: AuthUser) {
    return this.reportsService.findByUser(user.sub);
  }

  @Get('course/:courseId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  findByCourse(@Param('courseId') courseId: string) {
    return this.reportsService.findByCourse(courseId);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  upsert(@Body() dto: UpsertGradeDto, @CurrentUser() actor: AuthUser) {
    return this.reportsService.upsert(dto, actor);
  }

  @Get('certificate/:courseId')
  @Roles(Role.USER)
  async downloadCertificate(
    @Param('courseId') courseId: string,
    @CurrentUser() user: AuthUser,
    @Res() res: Response,
  ) {
    const pdf = await this.reportsService.generateCertificate(user.sub, courseId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=sertifikat-${courseId}.pdf`,
    });
    res.send(pdf);
  }
}
