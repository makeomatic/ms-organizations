const Bookshelf = require('bookshelf');
const bookshelfUUID = require('bookshelf-uuid');
const Flakeless = require('ms-flakeless');
const { globFiles } = require('ms-conf/lib/load-config');
const merge = require('lodash/merge');
const MService = require('mservice');
const memberModel = require('./models/member');
const MemberService = require('./services/member');
const organizationModel = require('./models/organization');
const OrganizationService = require('./services/organization');
const path = require('path');

const defaultConfig = globFiles(path.resolve(__dirname, 'configs'));
const { ConnectorsTypes } = MService;

class Service extends MService {
  constructor(config = {}) {
    //
    super(merge({}, defaultConfig, config));
    this.services = {};

    // flakeless
    this.flakeless = new Flakeless(this.config.flakeless);

    // connectors
    this.addConnector(ConnectorsTypes.migration, () => this.migrate('knex'));

    // models
    const bookshelf = this.bookshelf = Bookshelf(this.knex);

    bookshelf.plugin(bookshelfUUID, { type: () => this.flakeless.next() });
    bookshelf.plugin('pagination');
    bookshelf.plugin('registry');
    bookshelf.model('Organization', organizationModel);
    bookshelf.model('Member', memberModel);

    // services
    this.service('organization', OrganizationService);
    this.service('member', MemberService);
  }

  service(name, ServiceClass) {
    if (ServiceClass !== undefined) {
      this.services[name] = new ServiceClass(this);
    }

    return this.services[name];
  }
}

module.exports = Service;
