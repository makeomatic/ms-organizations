const fetcherFactory = require('../../fetchers/factory');

const fetcher = fetcherFactory('Organization');

/**
 * @api {amqp} <prefix>.organizations.delete Delete organization
 * @apiVersion 1.0.0
 * @apiName organizations.delete
 * @apiGroup Organization
 * @apiSchema {jsonschema=../../../schemas/organizations.delete.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/organizations.delete.response.json} apiSuccess
 */
function organizationsDeleteAction({ model }) {
  return model
    .destroy()
    .then(() => ({ status: 'success' }));
}

organizationsDeleteAction.fetcher = fetcher;
organizationsDeleteAction.schema = 'organizations.delete.request';
organizationsDeleteAction.transports = ['amqp'];

module.exports = organizationsDeleteAction;
