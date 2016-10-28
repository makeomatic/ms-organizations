const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('members.get', function suite() {
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

  it('should be able to get member', () => {
    const params = {
      organizationId: this.organization.id,
      userId: 'baz@bar.com',
    };

    return service.amqp
      .publishAndWait('organizations.members.get', params)
      .then((response) => {
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.organizationId, this.organization.id);
        assert.deepEqual(response.roles, []);
        assert.equal(response.userId, 'baz@bar.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
