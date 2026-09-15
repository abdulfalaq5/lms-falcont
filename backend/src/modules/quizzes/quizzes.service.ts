import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class QuizzesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async assertCanManageCourse(courseId: string, actor: AuthUser) {
    if (actor.role === Role.SUPER_ADMIN || actor.role === Role.ADMIN) return;
    const course = await this.knex('courses').where('id', courseId).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');
    if (course.instructor_id !== actor.sub) {
      throw new ForbiddenException('Anda hanya bisa mengelola kuis kelas yang Anda ampu');
    }
  }

  findByCourse(courseId: string) {
    return this.knex('quizzes').where('course_id', courseId).orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    const quiz = await this.knex('quizzes').where('id', id).first();
    if (!quiz) throw new NotFoundException('Kuis tidak ditemukan');
    return quiz;
  }

  async findQuestions(quizId: string) {
    await this.findById(quizId);
    return this.knex('quiz_questions').where('quiz_id', quizId);
  }

  async createQuiz(dto: CreateQuizDto, actor: AuthUser) {
    await this.assertCanManageCourse(dto.course_id, actor);
    const id = uuidv4();
    await this.knex('quizzes').insert({
      id,
      course_id: dto.course_id,
      title: dto.title,
      type: dto.type,
      created_by: actor.sub,
      created_at: new Date(),
    });
    return this.findById(id);
  }

  async addQuestion(quizId: string, dto: CreateQuestionDto, actor: AuthUser) {
    const quiz = await this.findById(quizId);
    await this.assertCanManageCourse(quiz.course_id, actor);
    const id = uuidv4();
    await this.knex('quiz_questions').insert({
      id,
      quiz_id: quizId,
      question_text: dto.question_text,
      options: dto.options ? JSON.stringify(dto.options) : null,
      correct_answer: dto.correct_answer ?? null,
      type: dto.type,
    });
    return this.knex('quiz_questions').where('id', id).first();
  }

  async submit(quizId: string, userId: string, dto: SubmitQuizDto) {
    const quiz = await this.findById(quizId);
    const existing = await this.knex('quiz_submissions')
      .where({ quiz_id: quizId, user_id: userId })
      .first();
    if (existing) throw new ForbiddenException('Anda sudah mengerjakan kuis ini');

    let score: number | null = null;
    if (quiz.type === 'pilihan_ganda') {
      const questions = await this.knex('quiz_questions').where('quiz_id', quizId);
      const correctCount = questions.filter(
        (q) => dto.answers[q.id] && dto.answers[q.id] === q.correct_answer,
      ).length;
      score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    }

    const id = uuidv4();
    await this.knex('quiz_submissions').insert({
      id,
      quiz_id: quizId,
      user_id: userId,
      answers: JSON.stringify(dto.answers),
      score,
      submitted_at: new Date(),
    });
    return this.knex('quiz_submissions').where('id', id).first();
  }

  async findSubmissions(quizId: string) {
    return this.knex('quiz_submissions as qs')
      .join('users as u', 'u.id', 'qs.user_id')
      .where('qs.quiz_id', quizId)
      .select('qs.*', 'u.name as user_name', 'u.email as user_email');
  }

  async gradeSubmission(submissionId: string, score: number, actor: AuthUser) {
    const submission = await this.knex('quiz_submissions').where('id', submissionId).first();
    if (!submission) throw new NotFoundException('Submission tidak ditemukan');
    const quiz = await this.findById(submission.quiz_id);
    await this.assertCanManageCourse(quiz.course_id, actor);
    await this.knex('quiz_submissions').where('id', submissionId).update({ score });
    return this.knex('quiz_submissions').where('id', submissionId).first();
  }
}
