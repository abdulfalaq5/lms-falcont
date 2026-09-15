import type { Knex } from 'knex';

export const CATEGORY_IDS = {
  programming: 'aaaaaaaa-0000-0000-0000-000000000001',
  design: 'aaaaaaaa-0000-0000-0000-000000000002',
  business: 'aaaaaaaa-0000-0000-0000-000000000003',
};

export async function seed(knex: Knex): Promise<void> {
  await knex('categories').del();

  await knex('categories').insert([
    { id: CATEGORY_IDS.programming, name: 'Pemrograman' },
    { id: CATEGORY_IDS.design, name: 'Desain' },
    { id: CATEGORY_IDS.business, name: 'Bisnis' },
  ]);
}
