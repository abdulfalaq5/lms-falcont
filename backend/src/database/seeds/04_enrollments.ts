import type { Knex } from 'knex';
import { USER_IDS } from './01_users';
import { COURSE_IDS } from './03_courses';

export async function seed(knex: Knex): Promise<void> {
  await knex('enrollments').del();

  await knex('enrollments').insert([
    { user_id: USER_IDS.user1, course_id: COURSE_IDS.webDev, status: 'active' },
    { user_id: USER_IDS.user2, course_id: COURSE_IDS.webDev, status: 'active' },
    { user_id: USER_IDS.user3, course_id: COURSE_IDS.webDev, status: 'completed' },
    { user_id: USER_IDS.user1, course_id: COURSE_IDS.uiux, status: 'pending' },
    { user_id: USER_IDS.user2, course_id: COURSE_IDS.uiux, status: 'approved' },
  ]);
}
