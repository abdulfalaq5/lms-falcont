import type { Knex } from 'knex';
import { USER_IDS } from './01_users';

export async function seed(knex: Knex): Promise<void> {
  await knex('audit_logs').del();

  await knex('audit_logs').insert([
    { user_id: USER_IDS.superAdmin, action: 'create', entity: 'users', entity_id: USER_IDS.admin },
    { user_id: USER_IDS.admin, action: 'create', entity: 'courses', entity_id: null },
  ]);
}
