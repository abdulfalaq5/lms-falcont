import type { Knex } from 'knex';
import { COURSE_IDS } from './03_courses';
import { USER_IDS } from './01_users';

export async function seed(knex: Knex): Promise<void> {
  await knex('forum_posts').del();

  const [rootPost] = await knex('forum_posts')
    .insert({
      course_id: COURSE_IDS.webDev,
      user_id: USER_IDS.user1,
      content: 'Apakah ada tips untuk memahami flexbox lebih cepat?',
      parent_id: null,
    })
    .returning('id');

  await knex('forum_posts').insert({
    course_id: COURSE_IDS.webDev,
    user_id: USER_IDS.instruktur1,
    content: 'Coba latihan di flexboxfroggy.com, cukup membantu!',
    parent_id: rootPost.id,
  });
}
