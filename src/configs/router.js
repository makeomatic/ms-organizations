const { ActionTransport, routerExtension } = require('mservice');
const path = require('path');

const { amqp } = ActionTransport;

module.exports = {
  router: {
    routes: {
      directory: path.resolve(__dirname, './../actions'),
      prefix: 'organizations',
      transports: [amqp],
    },
    extensions: {
      enabled: ['preRequest', 'preResponse'],
      register: [
        routerExtension('audit/log'),
      ],
    },
  },
};
