exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('organizations', (table) => {
      table.uuid('id').unique();
      table.string('name');
      table.string('owner_id');
      table.jsonb('meta');
      table.timestamps();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('organizations');
};
