const fetcherFactory = require('../../fetchers/factory');

const fetcher = fetcherFactory('Organization', { key: { id: 'organizationId' } });

/**
 * @api {amqp} <prefix>.members.create Create member of organization
 * @apiVersion 1.0.0
 * @apiName members.create
 * @apiGroup Member
 * @apiSchema {jsonschema=../../../schemas/members.create.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/members.create.response.json} apiSuccess
 */
function membersCreateAction({ params }) {
  const memberService = this.service('member');

  return memberService
    .create(params)
    .call('toJSON');
}

membersCreateAction.fetcher = fetcher;
membersCreateAction.schema = 'members.create.request';
membersCreateAction.transports = ['amqp'];

module.exports = membersCreateAction;
