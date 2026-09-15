import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@ApiTags('quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiQuery({ name: 'courseId', required: true })
  findByCourse(@Query('courseId') courseId: string) {
    return this.quizzesService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findById(id);
  }

  @Get(':id/questions')
  findQuestions(@Param('id') id: string) {
    return this.quizzesService.findQuestions(id);
  }

  @Get(':id/submissions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  findSubmissions(@Param('id') id: string) {
    return this.quizzesService.findSubmissions(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  create(@Body() dto: CreateQuizDto, @CurrentUser() actor: AuthUser) {
    return this.quizzesService.createQuiz(dto, actor);
  }

  @Post(':id/questions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  addQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto, @CurrentUser() actor: AuthUser) {
    return this.quizzesService.addQuestion(id, dto, actor);
  }

  @Post(':id/submit')
  @Roles(Role.USER)
  submit(@Param('id') id: string, @Body() dto: SubmitQuizDto, @CurrentUser() user: AuthUser) {
    return this.quizzesService.submit(id, user.sub, dto);
  }

  @Patch('submissions/:submissionId/grade')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUKTUR)
  gradeSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: GradeSubmissionDto,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.quizzesService.gradeSubmission(submissionId, dto.score, actor);
  }
}
