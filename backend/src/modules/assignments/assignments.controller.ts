import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';

@ApiTags('assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiQuery({ name: 'courseId', required: true })
  findByCourse(@Query('courseId') courseId: string) {
    return this.assignmentsService.findByCourse(courseId);
  }

  @Get('me/submissions')
  @Roles(Role.USER)
  findMySubmissions(@CurrentUser() user: AuthUser) {
    return this.assignmentsService.findMySubmissions(user.sub);
  }

  @Get(':id/submissions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  findSubmissions(@Param('id') id: string) {
    return this.assignmentsService.findSubmissions(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  create(@Body() dto: CreateAssignmentDto, @CurrentUser() actor: AuthUser) {
    return this.assignmentsService.create(dto, actor);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  update(@Param('id') id: string, @Body() dto: UpdateAssignmentDto, @CurrentUser() actor: AuthUser) {
    return this.assignmentsService.update(id, dto, actor);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthUser) {
    return this.assignmentsService.remove(id, actor);
  }

  @Post(':id/submit')
  @Roles(Role.USER)
  submit(@Param('id') id: string, @Body() dto: SubmitAssignmentDto, @CurrentUser() user: AuthUser) {
    return this.assignmentsService.submit(id, user.sub, dto.file_url);
  }

  @Patch('submissions/:submissionId/grade')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  gradeSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: GradeAssignmentDto,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.assignmentsService.gradeSubmission(submissionId, dto.grade, dto.feedback, actor);
  }
}
