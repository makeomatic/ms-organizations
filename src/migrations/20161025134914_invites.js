
exports.up = knex =>
  knex.schema
    .createTable('invites', (table) => {
      table
        .string('organizationId', 20)
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE');
      table.string('userId').notNullable();
      table.text('token').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();

      table.primary(['organizationId', 'userId']);
    });

exports.down = knex => knex.schema.dropTable('invites');
