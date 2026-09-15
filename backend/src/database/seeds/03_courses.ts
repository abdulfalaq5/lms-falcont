import type { Knex } from 'knex';
import { USER_IDS } from './01_users';
import { CATEGORY_IDS } from './02_categories';

export const COURSE_IDS = {
  webDev: 'bbbbbbbb-0000-0000-0000-000000000001',
  uiux: 'bbbbbbbb-0000-0000-0000-000000000002',
  digitalMarketing: 'bbbbbbbb-0000-0000-0000-000000000003',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('courses').del();

  await knex('courses').insert([
    {
      id: COURSE_IDS.webDev,
      title: 'Dasar Pengembangan Web',
      description: 'Belajar HTML, CSS, JavaScript, dan dasar-dasar backend.',
      category_id: CATEGORY_IDS.programming,
      instructor_id: USER_IDS.instruktur1,
      capacity: 30,
      is_open_enrollment: true,
      price: null,
      start_date: '2026-09-01',
      end_date: '2026-11-30',
      status: 'active',
    },
    {
      id: COURSE_IDS.uiux,
      title: 'Fundamental UI/UX Design',
      description: 'Prinsip desain antarmuka dan pengalaman pengguna.',
      category_id: CATEGORY_IDS.design,
      instructor_id: USER_IDS.instruktur2,
      capacity: 20,
      is_open_enrollment: false,
      price: 500000,
      start_date: '2026-09-15',
      end_date: '2026-12-15',
      status: 'active',
    },
    {
      id: COURSE_IDS.digitalMarketing,
      title: 'Strategi Digital Marketing',
      description: 'Menyusun strategi pemasaran digital untuk bisnis.',
      category_id: CATEGORY_IDS.business,
      instructor_id: USER_IDS.instruktur1,
      capacity: 25,
      is_open_enrollment: true,
      price: null,
      start_date: '2026-10-01',
      end_date: '2026-12-01',
      status: 'draft',
    },
  ]);
}
