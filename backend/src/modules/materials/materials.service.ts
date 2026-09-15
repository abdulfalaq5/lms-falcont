import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class MaterialsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async assertCanManageCourse(courseId: string, actor: AuthUser) {
    if (actor.role === Role.SUPER_ADMIN || actor.role === Role.ADMIN) return;
    const course = await this.knex('courses').where('id', courseId).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');
    if (course.instructor_id !== actor.sub) {
      throw new ForbiddenException('Anda hanya bisa mengelola materi kelas yang Anda ampu');
    }
  }

  findByCourse(courseId: string) {
    return this.knex('materials').where('course_id', courseId).orderBy('order', 'asc');
  }

  async findById(id: string) {
    const material = await this.knex('materials').where('id', id).first();
    if (!material) throw new NotFoundException('Materi tidak ditemukan');
    return material;
  }

  async create(dto: CreateMaterialDto, actor: AuthUser) {
    await this.assertCanManageCourse(dto.course_id, actor);
    const id = uuidv4();
    await this.knex('materials').insert({
      id,
      course_id: dto.course_id,
      title: dto.title,
      type: dto.type,
      content_url: dto.content_url,
      order: dto.order ?? 0,
      created_at: new Date(),
    });
    return this.findById(id);
  }

  async update(id: string, dto: UpdateMaterialDto, actor: AuthUser) {
    const material = await this.findById(id);
    await this.assertCanManageCourse(material.course_id, actor);
    await this.knex('materials').where('id', id).update(dto);
    return this.findById(id);
  }

  async remove(id: string, actor: AuthUser) {
    const material = await this.findById(id);
    await this.assertCanManageCourse(material.course_id, actor);
    await this.knex('materials').where('id', id).delete();
    return { deleted: true };
  }
}
