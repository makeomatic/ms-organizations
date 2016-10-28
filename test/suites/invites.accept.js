const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('invites.accept', function suite() {
  before('starting service', () => service.connect());

  before('create organization', () => {
    const organizationService = service.service('organization');
    const params = { name: chance.name(), ownerId: 'foo@bar.com' };

    return organizationService
      .create(params)
      .then((organization) => {
        this.organization = organization;
      });
  });

  before('create invite', () => {
    const inviteService = service.service('invite');
    const params = { organizationId: this.organization.id, userId: 'baz@bar.com' };

    return inviteService
      .create(params)
      .then((invite) => {
        this.invite = invite;
      });
  });

  after('stoping service', () => service.close());

  it('should be able to accept invite', () => {
    const params = {
      token: this.invite.get('token'),
    };

    return service.amqp
      .publishAndWait('organizations.invites.accept', params)
      .then((response) => {
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.organizationId, this.organization.id);
        assert.deepEqual(response.roles, []);
        assert.equal(response.userId, 'baz@bar.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
