const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('organizations.create', function suite() {
  before('starting service', () => service.connect());
  after('stoping service', () => service.close());

  it('should be able to create organization', () => {
    const params = {
      name: chance.name(),
      ownerId: 'foo@bar.com',
      meta: { foo: 'bar' },
    };

    return service.amqp
      .publishAndWait('organizations.organizations.create', params)
      .then((response) => {
        assert.ok(response.alias);
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.enabled, false);
        assert.ok(response.id);
        assert.deepEqual(response.meta, { foo: 'bar' });
        assert.ok(response.name);
        assert.equal(response.ownerId, 'foo@bar.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
