import type { Knex } from 'knex';
import { COURSE_IDS } from './03_courses';

export async function seed(knex: Knex): Promise<void> {
  await knex('materials').del();

  await knex('materials').insert([
    {
      course_id: COURSE_IDS.webDev,
      title: 'Pengenalan HTML & CSS',
      type: 'document',
      content_url: 'https://example.com/materi/html-css.pdf',
      order: 1,
    },
    {
      course_id: COURSE_IDS.webDev,
      title: 'Video: Dasar JavaScript',
      type: 'video',
      content_url: 'https://example.com/video/js-dasar',
      order: 2,
    },
    {
      course_id: COURSE_IDS.uiux,
      title: 'Prinsip Desain Visual',
      type: 'document',
      content_url: 'https://example.com/materi/prinsip-desain.pdf',
      order: 1,
    },
  ]);
}
