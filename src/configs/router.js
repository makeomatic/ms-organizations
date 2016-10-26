const { ActionTransport, routerExtension } = require('mservice');
const fetcherExtension = require('../fetchers/extension');
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
      enabled: ['preRequest', 'preResponse', 'postValidate'],
      register: [
        routerExtension('audit/log'),
        fetcherExtension,
      ],
    },
  },
};
