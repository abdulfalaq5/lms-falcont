import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';

@Injectable()
export class AuditLogsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async record(userId: string | null, action: string, entity: string, entityId?: string | null) {
    await this.knex('audit_logs').insert({
      id: uuidv4(),
      user_id: userId,
      action,
      entity,
      entity_id: entityId ?? null,
      created_at: new Date(),
    });
  }

  async findAll(limit = 100) {
    return this.knex('audit_logs')
      .leftJoin('users', 'users.id', 'audit_logs.user_id')
      .select(
        'audit_logs.id',
        'audit_logs.action',
        'audit_logs.entity',
        'audit_logs.entity_id',
        'audit_logs.created_at',
        'users.name as user_name',
        'users.email as user_email',
      )
      .orderBy('audit_logs.created_at', 'desc')
      .limit(limit);
  }
}
