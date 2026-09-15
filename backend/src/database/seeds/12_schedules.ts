import type { Knex } from 'knex';
import { COURSE_IDS } from './03_courses';

export const SCHEDULE_IDS = {
  webDevSession1: 'ffffffff-0000-0000-0000-000000000001',
  webDevDeadline1: 'ffffffff-0000-0000-0000-000000000002',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('schedules').del();

  await knex('schedules').insert([
    {
      id: SCHEDULE_IDS.webDevSession1,
      course_id: COURSE_IDS.webDev,
      title: 'Sesi Live: Pengenalan JavaScript',
      type: 'session',
      start_time: '2026-09-20T10:00:00Z',
      end_time: '2026-09-20T12:00:00Z',
    },
    {
      id: SCHEDULE_IDS.webDevDeadline1,
      course_id: COURSE_IDS.webDev,
      title: 'Deadline Tugas Halaman Profil',
      type: 'deadline',
      start_time: '2026-09-30T23:59:00Z',
      end_time: null,
    },
  ]);
}
