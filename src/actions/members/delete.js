const fetcherFactory = require('../../fetchers/factory');

const organizationFetcher = fetcherFactory('Organization', {
  key: { id: 'organizationId' },
  setTo: 'organization',
});
const memberFetcher = fetcherFactory('Member', {
  key: { organizationId: 'organizationId', userId: 'userId' } },
);

/**
 * @api {amqp} <prefix>.members.delete Delete member of organization
 * @apiVersion 1.0.0
 * @apiName members.delete
 * @apiGroup Member
 * @apiSchema {jsonschema=../../../schemas/members.delete.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/members.delete.response.json} apiSuccess
 */
function membersDeleteAction({ model }) {
  return model
    .where({ organizationId: model.get('organizationId'), userId: model.get('userId') })
    .destroy()
    .then(() => ({ status: 'success' }));
}

membersDeleteAction.syncFetchers = [organizationFetcher, memberFetcher];
membersDeleteAction.schema = 'members.delete.request';
membersDeleteAction.transports = ['amqp'];

module.exports = membersDeleteAction;
