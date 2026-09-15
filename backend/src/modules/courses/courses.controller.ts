import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  @ApiQuery({ name: 'instructorId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('instructorId') instructorId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
  ) {
    return this.coursesService.findAll({ instructorId, categoryId, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(@Body() dto: CreateCourseDto, @CurrentUser() actor: AuthUser) {
    const course = await this.coursesService.create(dto);
    await this.auditLogsService.record(actor.sub, 'create', 'courses', course.id);
    return course;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentUser() actor: AuthUser) {
    const course = await this.coursesService.update(id, dto);
    await this.auditLogsService.record(actor.sub, 'update', 'courses', id);
    return course;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() actor: AuthUser) {
    const result = await this.coursesService.softDelete(id);
    await this.auditLogsService.record(actor.sub, 'delete', 'courses', id);
    return result;
  }
}
