const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('members.delete', function suite() {
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

  before('create member', () => {
    const memberService = service.service('member');
    const params = { organizationId: this.organization.id, userId: 'baz@bar.com' };

    return memberService
      .create(params)
      .then((member) => {
        this.member = member;
      });
  });

  after('stoping service', () => service.close());

  it('should be able to delete member', () => {
    const params = {
      organizationId: this.organization.id,
      userId: 'baz@bar.com',
    };

    return service.amqp
      .publishAndWait('organizations.members.delete', params)
      .then((response) => {
        assert.deepEqual(response, { status: 'success' });
      });
  });
});
