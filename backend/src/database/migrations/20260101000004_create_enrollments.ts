import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('enrollments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE');
    table
      .enu('status', ['pending', 'approved', 'active', 'completed', 'dropped'])
      .notNullable()
      .defaultTo('pending');
    table.timestamp('enrolled_at').notNullable().defaultTo(knex.fn.now());
    table.unique(['user_id', 'course_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('enrollments');
}
