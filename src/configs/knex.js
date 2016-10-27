const path = require('path');

module.exports = {
  knex: {
    client: 'pg',
    connection: 'postgres://desu@localhost:5432/desu',
    migrations: {
      tableName: 'migrations',
      directory: path.resolve(__dirname, '../migrations'),
    },
  },
};
