import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../common/enums/role.enum';

const PUBLIC_COLUMNS = ['id', 'name', 'email', 'role', 'status', 'created_at'];

@Injectable()
export class UsersService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findAll(role?: Role) {
    const query = this.knex('users').whereNull('deleted_at').select(PUBLIC_COLUMNS);
    if (role) query.andWhere('role', role);
    return query.orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    const user = await this.knex('users')
      .whereNull('deleted_at')
      .andWhere('id', id)
      .select(PUBLIC_COLUMNS)
      .first();
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async findByEmail(email: string) {
    return this.knex('users').whereNull('deleted_at').andWhere('email', email).first();
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const id = uuidv4();
    await this.knex('users').insert({
      id,
      name: dto.name,
      email: dto.email,
      password_hash,
      role: dto.role,
      status: dto.status || 'active',
      created_at: new Date(),
    });
    return this.findById(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);
    const payload: Record<string, unknown> = { ...dto };
    delete payload.password;
    if (dto.password) {
      payload.password_hash = await bcrypt.hash(dto.password, 10);
    }
    await this.knex('users').where('id', id).update(payload);
    return this.findById(id);
  }

  async softDelete(id: string) {
    await this.findById(id);
    await this.knex('users').where('id', id).update({ deleted_at: new Date(), status: 'inactive' });
    return { deleted: true };
  }
}
