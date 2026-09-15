import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('quiz_questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('quiz_id').notNullable().references('id').inTable('quizzes').onDelete('CASCADE');
    table.text('question_text').notNullable();
    table.jsonb('options').nullable();
    table.text('correct_answer').nullable();
    table.enu('type', ['pilihan_ganda', 'essay']).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('quiz_questions');
}
