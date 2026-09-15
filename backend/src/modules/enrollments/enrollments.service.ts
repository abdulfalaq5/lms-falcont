import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private baseQuery() {
    return this.knex('enrollments as e')
      .join('courses as c', 'c.id', 'e.course_id')
      .join('users as u', 'u.id', 'e.user_id')
      .select(
        'e.*',
        'c.title as course_title',
        'c.is_open_enrollment',
        'u.name as user_name',
        'u.email as user_email',
      );
  }

  findByUser(userId: string) {
    return this.baseQuery().where('e.user_id', userId).orderBy('e.enrolled_at', 'desc');
  }

  findByCourse(courseId: string) {
    return this.baseQuery().where('e.course_id', courseId).orderBy('e.enrolled_at', 'desc');
  }

  findAll(status?: string) {
    const query = this.baseQuery();
    if (status) query.andWhere('e.status', status);
    return query.orderBy('e.enrolled_at', 'desc');
  }

  async findById(id: string) {
    const enrollment = await this.baseQuery().andWhere('e.id', id).first();
    if (!enrollment) throw new NotFoundException('Enrollment tidak ditemukan');
    return enrollment;
  }

  // Self-register ke kelas: open enrollment -> langsung active, selain itu -> pending menunggu approval Admin
  async enroll(userId: string, dto: CreateEnrollmentDto) {
    const existing = await this.knex('enrollments')
      .where({ user_id: userId, course_id: dto.course_id })
      .first();
    if (existing) throw new ConflictException('Anda sudah terdaftar di kelas ini');

    const course = await this.knex('courses').where('id', dto.course_id).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');

    const status = course.is_open_enrollment ? 'active' : 'pending';
    const id = uuidv4();
    await this.knex('enrollments').insert({
      id,
      user_id: userId,
      course_id: dto.course_id,
      status,
      enrolled_at: new Date(),
    });
    return this.findById(id);
  }

  async updateStatus(id: string, status: string) {
    await this.findById(id);
    await this.knex('enrollments').where('id', id).update({ status });
    return this.findById(id);
  }
}
