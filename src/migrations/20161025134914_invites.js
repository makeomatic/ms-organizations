
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('invites', (table) => {
      table.uuid('organization_id');
      table
        .foreign('organization_id')
        .references('organizations.id')
        .onDelete('CASCADE');
      table.string('challenge_type');
      table.string('destination');
      table.string('token');
      table.timestamps();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('invites');
};
