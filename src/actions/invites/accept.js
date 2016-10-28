/**
 * @api {amqp} <prefix>.invites.accept Accept invite
 * @apiVersion 1.0.0
 * @apiName invites.accept
 * @apiGroup Invite
 * @apiSchema {jsonschema=../../../schemas/members.accept.request.json} apiParam
 * @apiSchema {jsonschema=../../../schemas/members.accept.response.json} apiSuccess
 */
function invitesAcceptAction({ params }) {
  const inviteService = this.service('invite');

  return inviteService
    .accept(params)
    .call('toJSON');
}

invitesAcceptAction.schema = 'invites.accept.request';
invitesAcceptAction.transports = ['amqp'];

module.exports = invitesAcceptAction;
