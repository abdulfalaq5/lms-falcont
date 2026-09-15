import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('quiz_submissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('quiz_id').notNullable().references('id').inTable('quizzes').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.jsonb('answers').notNullable();
    table.decimal('score', 5, 2).nullable();
    table.timestamp('submitted_at').notNullable().defaultTo(knex.fn.now());
    table.unique(['quiz_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('quiz_submissions');
}
