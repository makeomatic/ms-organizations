/**
 * @api {amqp} <prefix>.members.list Get list of members
 * @apiVersion 1.0.0
 * @apiName members.list
 * @apiGroup Member
 * @apiSchema {jsonschema=../../../schemas/members.list.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/members.list.response.json} apiSuccess
 */
function membersListAction({ params }) {
  const memberService = this.service('member');

  return memberService
    .fetchAll(params)
    .call('toJSON');
}

membersListAction.schema = 'members.list.request';
membersListAction.transports = ['amqp'];

module.exports = membersListAction;
