import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private baseQuery() {
    return this.knex('courses as c')
      .leftJoin('categories as cat', 'cat.id', 'c.category_id')
      .leftJoin('users as instr', 'instr.id', 'c.instructor_id')
      .whereNull('c.deleted_at')
      .select(
        'c.*',
        'cat.name as category_name',
        'instr.name as instructor_name',
      );
  }

  findAll(filters: { instructorId?: string; categoryId?: string; status?: string }) {
    const query = this.baseQuery();
    if (filters.instructorId) query.andWhere('c.instructor_id', filters.instructorId);
    if (filters.categoryId) query.andWhere('c.category_id', filters.categoryId);
    if (filters.status) query.andWhere('c.status', filters.status);
    return query.orderBy('c.created_at', 'desc');
  }

  async findById(id: string) {
    const course = await this.baseQuery().andWhere('c.id', id).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');
    return course;
  }

  async create(dto: CreateCourseDto) {
    const id = uuidv4();
    await this.knex('courses').insert({
      id,
      title: dto.title,
      description: dto.description ?? null,
      category_id: dto.category_id ?? null,
      instructor_id: dto.instructor_id ?? null,
      capacity: dto.capacity ?? null,
      is_open_enrollment: dto.is_open_enrollment ?? true,
      price: dto.price ?? null,
      start_date: dto.start_date ?? null,
      end_date: dto.end_date ?? null,
      status: dto.status ?? 'draft',
      created_at: new Date(),
    });
    return this.findById(id);
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findById(id);
    await this.knex('courses').where('id', id).update(dto);
    return this.findById(id);
  }

  async softDelete(id: string) {
    await this.findById(id);
    await this.knex('courses').where('id', id).update({ deleted_at: new Date() });
    return { deleted: true };
  }
}
