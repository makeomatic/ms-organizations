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
  redis: {
    hosts: [
      { host: 'redis-1', port: 6379 },
      { host: 'redis-2', port: 6379 },
      { host: 'redis-3', port: 6379 },
    ],
  },
};

module.exports = config;
