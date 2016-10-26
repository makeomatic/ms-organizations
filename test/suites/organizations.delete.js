const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const Service = require('../../src');

const chance = new Chance();
const service = new Service(config);

describe('organizations.delete', function suite() {
  before('starting service', () => service.connect());
  after('stoping service', () => service.close());

  it('should be able to delete organization', () => {
    const { organization: organizationService } = service.services;
    const params = {
      name: chance.name(),
      ownerId: 'foo@bar.com',
    };

    return organizationService
      .create(params)
      .then(organization =>
        service.amqp
          .publishAndWait('organizations.organizations.delete', { id: organization.id })
      )
      .then((result) => {
        assert.deepEqual(result, { status: 'success' });
      });
  });
});
