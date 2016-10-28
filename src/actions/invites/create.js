const fetcherFactory = require('../../fetchers/factory');
const Errors = require('common-errors');

const organizationFetcher = fetcherFactory('Organization', {
  key: { id: 'organizationId' },
  setTo: 'organization',
});
const memberFetcher = fetcherFactory('Member', {
  key: { organizationId: 'organizationId', userId: 'userId' },
  require: false,
  setTo: 'member',
});

/**
 * @api {amqp} <prefix>.invites.create Invite member of organization
 * @apiVersion 1.0.0
 * @apiName invites.create
 * @apiGroup Invite
 * @apiSchema {jsonschema=../../../schemas/members.invites.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/members.invites.response.json} apiSuccess
 */
function invitesCreateAction({ params, member }) {
  if (member) {
    throw new Errors.NotPermittedError(`${member.get('userId')} already in organization`);
  }

  const inviteService = this.service('invite');

  return inviteService
    .create(params)
    .call('toJSON');
}

invitesCreateAction.syncFetchers = [organizationFetcher, memberFetcher];
invitesCreateAction.schema = 'invites.create.request';
invitesCreateAction.transports = ['amqp'];

module.exports = invitesCreateAction;
