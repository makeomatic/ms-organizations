const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Promise = require('bluebird');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('organizations.list', function suite() {
  before('starting service', () => service.connect());
  after('stoping service', () => service.close());

  it('should be able to get list of organizations', () => {
    const { organization: factory } = service.services;
    const ownerId = chance.email();

    return Promise.all([
      factory.create({ name: chance.name(), ownerId, meta: { foo: 'bar', baz: 1 } }),
      factory.create({ name: chance.name(), ownerId, meta: { foo: 'bar', baz: 2 } }),
      factory.create({ name: chance.name(), ownerId, meta: { foo: 'qux', baz: 3 } }),
    ])
    .then(() =>
      service.amqp
        .publishAndWait('organizations.organizations.list', {
          filter: { meta: { foo: 'bar' }, ownerId },
          sort: ['-meta.baz', 'id'],
          page: 2,
          pageSize: 1,
        })
    )
    .then((response) => {
      const organization = response[0];

      assert.ok(organization.alias);
      assert.equal(isISODate(organization.createdAt), true);
      assert.equal(organization.enabled, false);
      assert.ok(organization.id);
      assert.deepEqual(organization.meta, { baz: 1, foo: 'bar' });
      assert.ok(organization.name);
      assert.equal(organization.ownerId, ownerId);
      assert.equal(isISODate(organization.updatedAt), true);
    });
  });
});
