import type { Knex } from 'knex';
import { SCHEDULE_IDS } from './12_schedules';
import { USER_IDS } from './01_users';

export async function seed(knex: Knex): Promise<void> {
  await knex('attendance').del();

  await knex('attendance').insert([
    { schedule_id: SCHEDULE_IDS.webDevSession1, user_id: USER_IDS.user1, status: 'hadir' },
    { schedule_id: SCHEDULE_IDS.webDevSession1, user_id: USER_IDS.user2, status: 'izin' },
  ]);
}
