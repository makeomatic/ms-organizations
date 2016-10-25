const config = require('../configs/service');
const Service = require('../../src');

const service = new Service(config);

describe('organizations.create', function suite() {
  before('starting service', () => service.connect());
  after('stoping service', () => service.close());

  it('should be able to create organization', () => {
    const params = {};

    return service.amqp
      .publishAndWait('organizations.organizations.create', params)
      .then(response => {
        console.log(response);
      });
  });
});
