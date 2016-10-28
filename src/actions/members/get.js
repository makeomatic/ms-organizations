const fetcherFactory = require('../../fetchers/factory');

const organizationFetcher = fetcherFactory('Organization', {
  key: { id: 'organizationId' },
  setTo: 'organization',
});
const memberFetcher = fetcherFactory('Member', {
  key: { organizationId: 'organizationId', userId: 'userId' } },
);

/**
 * @api {amqp} <prefix>.members.get Get member of organization
 * @apiVersion 1.0.0
 * @apiName members.get
 * @apiGroup Member
 * @apiSchema {jsonschema=../../../schemas/members.get.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/members.get.response.json} apiSuccess
 */
function membersGetAction({ model }) {
  return model.toJSON();
}

membersGetAction.syncFetchers = [organizationFetcher, memberFetcher];
membersGetAction.schema = 'members.get.request';
membersGetAction.transports = ['amqp'];

module.exports = membersGetAction;
