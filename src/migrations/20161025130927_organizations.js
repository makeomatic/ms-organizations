exports.up = knex =>
  knex.schema
    .createTable('organizations', (table) => {
      table.string('id', 20).primary().notNullable();
      table.string('ownerId').notNullable();
      table.string('name').notNullable().unique();
      table.string('alias').notNullable().unique();
      table.boolean('enabled').notNullable();
      table.jsonb('meta').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();
    });

exports.down = knex => knex.schema.dropTable('organizations');
