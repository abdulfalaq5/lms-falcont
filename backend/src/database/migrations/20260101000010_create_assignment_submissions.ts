import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('assignment_submissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('assignment_id')
      .notNullable()
      .references('id')
      .inTable('assignments')
      .onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('file_url').notNullable();
    table.timestamp('submitted_at').notNullable().defaultTo(knex.fn.now());
    table.decimal('grade', 5, 2).nullable();
    table.text('feedback').nullable();
    table.timestamp('deleted_at').nullable();
    table.unique(['assignment_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('assignment_submissions');
}
