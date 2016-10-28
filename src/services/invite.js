class Invite {
  static INVITE_ACTION = 'invite';

  constructor(application) {
    this.Model = application.bookshelf.model('Invite');
    this.tokenManager = application.tokenManager;
    this.memberService = application.service('member');
  }

  create(params) {
    const attributes = Object.assign({}, params);
    const { organizationId, userId } = attributes;

    return this.tokenManager
      .create({
        action: Invite.INVITE_ACTION,
        id: organizationId + userId,
        metadata: { organizationId, userId },
        ttl: 31 * 24 * 60 * 60,
      })
      .then(({ secret }) => {
        attributes.token = secret;

        return this.Model.forge().save(attributes);
      });
  }

  accept(params) {
    const { token } = params;

    return this.tokenManager
      .verify(token)
      .then(({ metadata }) => {
        const { organizationId, userId } = metadata;

        return this.memberService.create({ organizationId, userId });
      })
      .tap(member =>
        this.Model
          .forge()
          .where({ organizationId: member.get('organizationId'), userId: member.get('userId') })
          .destroy()
      );
  }
}

module.exports = Invite;
