import type { Knex } from 'knex';
import { ASSIGNMENT_IDS } from './09_assignments';
import { USER_IDS } from './01_users';

export async function seed(knex: Knex): Promise<void> {
  await knex('assignment_submissions').del();

  await knex('assignment_submissions').insert([
    {
      assignment_id: ASSIGNMENT_IDS.webDevTask1,
      user_id: USER_IDS.user1,
      file_url: 'https://example.com/submissions/andi-profil.zip',
      grade: 90,
      feedback: 'Bagus, rapi dan sesuai instruksi.',
    },
    {
      assignment_id: ASSIGNMENT_IDS.webDevTask1,
      user_id: USER_IDS.user2,
      file_url: 'https://example.com/submissions/rina-profil.zip',
      grade: null,
      feedback: null,
    },
  ]);
}
