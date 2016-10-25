
exports.up = knex =>
  knex.schema
    .createTable('members', (table) => {
      table.string('organizationId', 20).notNullable();
      table.string('userId').notNullable();
      table.specificType('roles', 'varchar[255][]').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();

      table
        .foreign('organizationId')
        .references('organizations.id')
        .onDelete('CASCADE');
      table
        .primary(['organizationId', 'userId']);
    });

exports.down = knex => knex.schema.dropTable('members');
