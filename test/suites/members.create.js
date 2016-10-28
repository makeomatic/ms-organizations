const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('members.create', function suite() {
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
  after('stoping service', () => service.close());

  it('should be able to create member', () => {
    const params = {
      organizationId: this.organization.id,
      userId: 'foo@bar.com',
    };

    return service.amqp
      .publishAndWait('organizations.members.create', params)
      .then((response) => {
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.organizationId, this.organization.id);
        assert.deepEqual(response.roles, []);
        assert.equal(response.userId, 'foo@bar.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
