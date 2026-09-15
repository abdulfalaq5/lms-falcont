import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  findAll() {
    return this.knex('categories').whereNull('deleted_at').orderBy('name', 'asc');
  }

  async findById(id: string) {
    const category = await this.knex('categories').whereNull('deleted_at').andWhere('id', id).first();
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const id = uuidv4();
    await this.knex('categories').insert({ id, name: dto.name, created_at: new Date() });
    return this.findById(id);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);
    await this.knex('categories').where('id', id).update(dto);
    return this.findById(id);
  }

  async softDelete(id: string) {
    await this.findById(id);
    await this.knex('categories').where('id', id).update({ deleted_at: new Date() });
    return { deleted: true };
  }
}
