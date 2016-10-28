/**
 * @api {amqp} <prefix>.organizations.list Get list of organizations
 * @apiVersion 1.0.0
 * @apiName organizations.list
 * @apiGroup Organization
 * @apiSchema {jsonschema=../../../schemas/organizations.list.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/organizations.list.response.json} apiSuccess
 */
function organizationsListAction({ params }) {
  const organizationService = this.service('organization');

  return organizationService
    .fetchAll(params)
    .call('toJSON');
}

organizationsListAction.schema = 'organizations.list.request';
organizationsListAction.transports = ['amqp'];

module.exports = organizationsListAction;
