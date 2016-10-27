/**
 * @api {amqp} <prefix>.organizations.create Create organization
 * @apiVersion 1.0.0
 * @apiName organizations.create
 * @apiGroup Organization
 * @apiSchema {jsonschema=../../schemas/organizations.create.request.json} apiParam
 * @apiSchema {jsonschema=../../schemas/organizations.create.response.json} apiSuccess
 */
function organizationsCreateAction({ params }) {
  const { organization } = this.services;

  return organization
    .create(params)
    .call('toJSON');
}

organizationsCreateAction.schema = 'organizations.create.request';
organizationsCreateAction.transports = ['amqp'];

module.exports = organizationsCreateAction;
