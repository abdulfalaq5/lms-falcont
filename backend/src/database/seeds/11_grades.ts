import type { Knex } from 'knex';
import { USER_IDS } from './01_users';
import { COURSE_IDS } from './03_courses';

export async function seed(knex: Knex): Promise<void> {
  await knex('grades').del();

  await knex('grades').insert([
    {
      user_id: USER_IDS.user3,
      course_id: COURSE_IDS.webDev,
      final_score: 88,
      certificate_issued: true,
    },
    {
      user_id: USER_IDS.user1,
      course_id: COURSE_IDS.webDev,
      final_score: null,
      certificate_issued: false,
    },
  ]);
}
