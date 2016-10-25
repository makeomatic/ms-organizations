
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('members', (table) => {
      table.uuid('organization_id');
      table
        .foreign('organization_id')
        .references('organizations.id')
        .onDelete('CASCADE');
      table.string('user_id');
      table.specificType('roles', 'varchar[255][]');
      table.timestamps();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('members');
};
