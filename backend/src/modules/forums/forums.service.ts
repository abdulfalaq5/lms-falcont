import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateForumPostDto } from './dto/create-forum-post.dto';

@Injectable()
export class ForumsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  findByCourse(courseId: string) {
    return this.knex('forum_posts as f')
      .join('users as u', 'u.id', 'f.user_id')
      .where('f.course_id', courseId)
      .select('f.*', 'u.name as user_name')
      .orderBy('f.created_at', 'asc');
  }

  async create(dto: CreateForumPostDto, userId: string) {
    const course = await this.knex('courses').where('id', dto.course_id).first();
    if (!course) throw new NotFoundException('Kelas tidak ditemukan');

    const id = uuidv4();
    await this.knex('forum_posts').insert({
      id,
      course_id: dto.course_id,
      user_id: userId,
      content: dto.content,
      parent_id: dto.parent_id ?? null,
      created_at: new Date(),
    });
    return this.knex('forum_posts').where('id', id).first();
  }

  async remove(id: string) {
    const post = await this.knex('forum_posts').where('id', id).first();
    if (!post) throw new NotFoundException('Post tidak ditemukan');
    await this.knex('forum_posts').where('id', id).delete();
    return { deleted: true };
  }
}
