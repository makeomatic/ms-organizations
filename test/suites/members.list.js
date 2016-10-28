const assert = require('assert');
const Chance = require('chance');
const config = require('../configs/service');
const isISODate = require('../helpers/asserts/ISODate');
const Promise = require('bluebird');
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
    const organizationId = this.organization.id;

    return Promise.all([
      memberService.create({ organizationId, userId: 'a@foo.com' }),
      memberService.create({ organizationId, userId: 'b@foo.com' }),
      memberService.create({ organizationId, userId: 'c@foo.com' }),
    ]);
  });

  after('stoping service', () => service.close());

  it('should be able to get list of members', () => {
    const organizationId = this.organization.id;
    const params = {
      filter: { organizationId },
      sort: ['-userId'],
      page: 3,
      pageSize: 1,
    };

    return service.amqp
      .publishAndWait('organizations.members.list', params)
      .then(({ 0: response }) => {
        assert.equal(isISODate(response.createdAt), true);
        assert.equal(response.organizationId, this.organization.id);
        assert.deepEqual(response.roles, []);
        assert.equal(response.userId, 'a@foo.com');
        assert.equal(isISODate(response.updatedAt), true);
      });
  });
});
