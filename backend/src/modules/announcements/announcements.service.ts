import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AnnouncementsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  findAll(courseId?: string) {
    const query = this.knex('announcements').orderBy('created_at', 'desc');
    if (courseId) query.andWhere('course_id', courseId);
    else query.whereNull('course_id');
    return query;
  }

  async findById(id: string) {
    const announcement = await this.knex('announcements').where('id', id).first();
    if (!announcement) throw new NotFoundException('Pengumuman tidak ditemukan');
    return announcement;
  }

  async create(dto: CreateAnnouncementDto, actor: AuthUser) {
    if (dto.course_id && actor.role === Role.INSTRUKTUR) {
      const course = await this.knex('courses').where('id', dto.course_id).first();
      if (!course || course.instructor_id !== actor.sub) {
        throw new ForbiddenException('Anda hanya bisa membuat pengumuman untuk kelas yang Anda ampu');
      }
    }
    if (!dto.course_id && actor.role !== Role.SUPER_ADMIN && actor.role !== Role.ADMIN) {
      throw new ForbiddenException('Hanya Admin/Super Admin yang bisa membuat pengumuman global');
    }
    const id = uuidv4();
    await this.knex('announcements').insert({
      id,
      course_id: dto.course_id ?? null,
      title: dto.title,
      content: dto.content,
      created_by: actor.sub,
      created_at: new Date(),
    });
    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);
    await this.knex('announcements').where('id', id).delete();
    return { deleted: true };
  }
}
