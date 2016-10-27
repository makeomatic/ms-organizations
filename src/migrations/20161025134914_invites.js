
exports.up = knex =>
  knex.schema
    .createTable('invites', (table) => {
      table.string('organizationId', 20);
      table.string('challengeType');
      table.string('destination');
      table.string('token');
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();

      table.primary(['organizationId', 'destination']);
      table
        .foreign('organizationId')
        .references('organizations.id')
        .onDelete('CASCADE');
    });

exports.down = knex => knex.schema.dropTable('invites');
