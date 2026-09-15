import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class SchedulesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async assertCanManageCourse(courseId: string, actor: AuthUser) {
    if (actor.role === Role.SUPER_ADMIN || actor.role === Role.ADMIN) return;
    const course = await this.knex('courses').where('id', courseId).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');
    if (course.instructor_id !== actor.sub) {
      throw new ForbiddenException('Anda hanya bisa mengelola jadwal kelas yang Anda ampu');
    }
  }

  private baseQuery() {
    return this.knex('schedules as s')
      .join('courses as c', 'c.id', 's.course_id')
      .select('s.*', 'c.title as course_title', 'c.instructor_id');
  }

  // Kalender berbeda sesuai role: Admin (semua), Instruktur (kelas diampu), User (kelas diikuti)
  async calendarFor(actor: AuthUser) {
    const query = this.baseQuery();
    if (actor.role === Role.SUPER_ADMIN || actor.role === Role.ADMIN) {
      return query.orderBy('s.start_time', 'asc');
    }
    if (actor.role === Role.INSTRUKTUR) {
      return query.where('c.instructor_id', actor.sub).orderBy('s.start_time', 'asc');
    }
    const courseIds = (
      await this.knex('enrollments')
        .where('user_id', actor.sub)
        .whereIn('status', ['active', 'approved', 'completed'])
        .select('course_id')
    ).map((e) => e.course_id);
    return query.whereIn('s.course_id', courseIds).orderBy('s.start_time', 'asc');
  }

  findByCourse(courseId: string) {
    return this.knex('schedules').where('course_id', courseId).orderBy('start_time', 'asc');
  }

  async findById(id: string) {
    const schedule = await this.knex('schedules').where('id', id).first();
    if (!schedule) throw new NotFoundException('Jadwal tidak ditemukan');
    return schedule;
  }

  async create(dto: CreateScheduleDto, actor: AuthUser) {
    await this.assertCanManageCourse(dto.course_id, actor);
    const id = uuidv4();
    await this.knex('schedules').insert({
      id,
      course_id: dto.course_id,
      title: dto.title,
      type: dto.type,
      start_time: dto.start_time,
      end_time: dto.end_time ?? null,
    });
    return this.findById(id);
  }

  async update(id: string, dto: UpdateScheduleDto, actor: AuthUser) {
    const schedule = await this.findById(id);
    await this.assertCanManageCourse(schedule.course_id, actor);
    await this.knex('schedules').where('id', id).update(dto);
    return this.findById(id);
  }

  async remove(id: string, actor: AuthUser) {
    const schedule = await this.findById(id);
    await this.assertCanManageCourse(schedule.course_id, actor);
    await this.knex('schedules').where('id', id).delete();
    return { deleted: true };
  }
}
