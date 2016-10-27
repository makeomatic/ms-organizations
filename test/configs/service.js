const config = {
  amqp: {
    transport: {
      connection: {
        host: 'rabbitmq',
      },
    },
  },
  knex: {
    connection: 'postgres://postgres@pg:5432/postgres',
  },
};

module.exports = config;
