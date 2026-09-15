import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AssignmentsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async assertCanManageCourse(courseId: string, actor: AuthUser) {
    if (actor.role === Role.SUPER_ADMIN || actor.role === Role.ADMIN) return;
    const course = await this.knex('courses').where('id', courseId).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');
    if (course.instructor_id !== actor.sub) {
      throw new ForbiddenException('Anda hanya bisa mengelola tugas kelas yang Anda ampu');
    }
  }

  findByCourse(courseId: string) {
    return this.knex('assignments').where('course_id', courseId).orderBy('due_date', 'asc');
  }

  async findById(id: string) {
    const assignment = await this.knex('assignments').where('id', id).first();
    if (!assignment) throw new NotFoundException('Tugas tidak ditemukan');
    return assignment;
  }

  async create(dto: CreateAssignmentDto, actor: AuthUser) {
    await this.assertCanManageCourse(dto.course_id, actor);
    const id = uuidv4();
    await this.knex('assignments').insert({
      id,
      course_id: dto.course_id,
      title: dto.title,
      description: dto.description ?? null,
      due_date: dto.due_date ?? null,
      created_at: new Date(),
    });
    return this.findById(id);
  }

  async update(id: string, dto: UpdateAssignmentDto, actor: AuthUser) {
    const assignment = await this.findById(id);
    await this.assertCanManageCourse(assignment.course_id, actor);
    await this.knex('assignments').where('id', id).update(dto);
    return this.findById(id);
  }

  async remove(id: string, actor: AuthUser) {
    const assignment = await this.findById(id);
    await this.assertCanManageCourse(assignment.course_id, actor);
    await this.knex('assignments').where('id', id).delete();
    return { deleted: true };
  }

  async submit(assignmentId: string, userId: string, fileUrl: string) {
    await this.findById(assignmentId);
    const existing = await this.knex('assignment_submissions')
      .whereNull('deleted_at')
      .andWhere({ assignment_id: assignmentId, user_id: userId })
      .first();

    if (existing) {
      await this.knex('assignment_submissions')
        .where('id', existing.id)
        .update({ file_url: fileUrl, submitted_at: new Date() });
      return this.knex('assignment_submissions').where('id', existing.id).first();
    }

    const id = uuidv4();
    await this.knex('assignment_submissions').insert({
      id,
      assignment_id: assignmentId,
      user_id: userId,
      file_url: fileUrl,
      submitted_at: new Date(),
    });
    return this.knex('assignment_submissions').where('id', id).first();
  }

  findSubmissions(assignmentId: string) {
    return this.knex('assignment_submissions as s')
      .join('users as u', 'u.id', 's.user_id')
      .whereNull('s.deleted_at')
      .andWhere('s.assignment_id', assignmentId)
      .select('s.*', 'u.name as user_name', 'u.email as user_email');
  }

  findMySubmissions(userId: string) {
    return this.knex('assignment_submissions as s')
      .join('assignments as a', 'a.id', 's.assignment_id')
      .whereNull('s.deleted_at')
      .andWhere('s.user_id', userId)
      .select('s.*', 'a.title as assignment_title', 'a.course_id');
  }

  async gradeSubmission(submissionId: string, grade: number, feedback: string | undefined, actor: AuthUser) {
    const submission = await this.knex('assignment_submissions').where('id', submissionId).first();
    if (!submission) throw new NotFoundException('Submission tidak ditemukan');
    const assignment = await this.findById(submission.assignment_id);
    await this.assertCanManageCourse(assignment.course_id, actor);
    await this.knex('assignment_submissions').where('id', submissionId).update({ grade, feedback });
    return this.knex('assignment_submissions').where('id', submissionId).first();
  }
}
