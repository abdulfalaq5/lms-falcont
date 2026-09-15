import type { Knex } from 'knex';
import { COURSE_IDS } from './03_courses';
import { USER_IDS } from './01_users';

export async function seed(knex: Knex): Promise<void> {
  await knex('announcements').del();

  await knex('announcements').insert([
    {
      course_id: null,
      title: 'Selamat Datang di LMS',
      content: 'Platform LMS resmi diluncurkan. Selamat belajar!',
      created_by: USER_IDS.superAdmin,
    },
    {
      course_id: COURSE_IDS.webDev,
      title: 'Perubahan Jadwal Sesi Live',
      content: 'Sesi live minggu ini dipindah ke hari Jumat pukul 10.00.',
      created_by: USER_IDS.instruktur1,
    },
  ]);
}
