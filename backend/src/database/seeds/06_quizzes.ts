import type { Knex } from 'knex';
import { COURSE_IDS } from './03_courses';
import { USER_IDS } from './01_users';

export const QUIZ_IDS = {
  webDevQuiz: 'cccccccc-0000-0000-0000-000000000001',
  uiuxQuiz: 'cccccccc-0000-0000-0000-000000000002',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('quizzes').del();

  await knex('quizzes').insert([
    {
      id: QUIZ_IDS.webDevQuiz,
      course_id: COURSE_IDS.webDev,
      title: 'Kuis Dasar HTML & CSS',
      type: 'pilihan_ganda',
      created_by: USER_IDS.instruktur1,
    },
    {
      id: QUIZ_IDS.uiuxQuiz,
      course_id: COURSE_IDS.uiux,
      title: 'Kuis Prinsip Desain',
      type: 'essay',
      created_by: USER_IDS.instruktur2,
    },
  ]);
}
