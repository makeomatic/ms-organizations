const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const is = require('is');
const isISODate = require('../helpers/asserts/ISODate');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('invites.create', function suite() {
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

  it('should return error if already in organization', () => {
    const params = {
      organizationId: this.organization.id,
      userId: 'baz@bar.com',
    };

    return service.amqp
      .publishAndWait('organizations.invites.create', params)
      .reflect()
      .then(inspection => inspection.reason())
      .then((error) => {
        assert.equal(error.name, 'NotPermittedError');
        assert.equal(error.message, 'An attempt was made to perform an operation that' +
          ' is not permitted: baz@bar.com already in organization');
      });
  });

  it('should be able to invite user', () => {
    const params = {
      organizationId: this.organization.id,
      userId: 'qux@bar.com',
    };

    return service.amqp
      .publishAndWait('organizations.invites.create', params)
      .then((response) => {
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.organizationId, this.organization.id);
        assert.ok(is.string(response.token));
        assert.equal(response.userId, 'qux@bar.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
