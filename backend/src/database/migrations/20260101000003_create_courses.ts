import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('courses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description').nullable();
    table.uuid('category_id').references('id').inTable('categories').onDelete('SET NULL');
    table.uuid('instructor_id').references('id').inTable('users').onDelete('SET NULL');
    table.integer('capacity').nullable();
    table.boolean('is_open_enrollment').notNullable().defaultTo(true);
    table.decimal('price', 12, 2).nullable();
    table.date('start_date').nullable();
    table.date('end_date').nullable();
    table.string('status').notNullable().defaultTo('draft');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('courses');
}
