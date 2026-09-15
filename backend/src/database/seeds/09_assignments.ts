import type { Knex } from 'knex';
import { COURSE_IDS } from './03_courses';

export const ASSIGNMENT_IDS = {
  webDevTask1: 'eeeeeeee-0000-0000-0000-000000000001',
  uiuxTask1: 'eeeeeeee-0000-0000-0000-000000000002',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('assignments').del();

  await knex('assignments').insert([
    {
      id: ASSIGNMENT_IDS.webDevTask1,
      course_id: COURSE_IDS.webDev,
      title: 'Membuat Halaman Profil Sederhana',
      description: 'Buat halaman profil menggunakan HTML & CSS.',
      due_date: '2026-09-30T23:59:00Z',
    },
    {
      id: ASSIGNMENT_IDS.uiuxTask1,
      course_id: COURSE_IDS.uiux,
      title: 'Wireframe Aplikasi Mobile',
      description: 'Buat wireframe low-fidelity untuk aplikasi mobile sederhana.',
      due_date: '2026-10-15T23:59:00Z',
    },
  ]);
}
