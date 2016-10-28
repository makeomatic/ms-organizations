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
  flakeless: {
    epochStart: 1474027714363,
  },
};

module.exports = config;
