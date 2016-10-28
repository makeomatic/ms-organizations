const fetcherFactory = require('../../fetchers/factory');

const fetcher = fetcherFactory('Organization');

/**
 * @api {amqp} <prefix>.organizations.get Get organization
 * @apiVersion 1.0.0
 * @apiName organizations.get
 * @apiGroup Organization
 * @apiSchema {jsonschema=../../../schemas/organizations.get.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/organizations.get.response.json} apiSuccess
 */
function organizationsGetAction({ model }) {
  return model.toJSON();
}

organizationsGetAction.fetcher = fetcher;
organizationsGetAction.schema = 'organizations.get.request';
organizationsGetAction.transports = ['amqp'];

module.exports = organizationsGetAction;
