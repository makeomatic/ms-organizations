const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('organizations.get', function suite() {
  before('starting service', () => service.connect());
  after('stoping service', () => service.close());

  it('should be able to get organization', () => {
    const { organization: organizationService } = service.services;
    const params = {
      name: chance.name(),
      ownerId: 'foo@bar.com',
    };

    return organizationService
      .create(params)
      .then(organization =>
        service.amqp
          .publishAndWait('organizations.organizations.get', { id: organization.id })
      )
      .then((response) => {
        assert.ok(response.alias);
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.enabled, false);
        assert.ok(response.id);
        assert.deepEqual(response.meta, {});
        assert.ok(response.name);
        assert.equal(response.ownerId, 'foo@bar.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
