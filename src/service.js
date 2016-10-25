const Bookshelf = require('bookshelf');
const bookshelfUUID = require('bookshelf-uuid');
const Flakeless = require('ms-flakeless');
const { globFiles } = require('ms-conf/lib/load-config');
const merge = require('lodash/merge');
const MService = require('mservice');
const organizationModelFactory = require('./models/organization');
const OrganizationService = require('./services/organization');
const path = require('path');

const defaultConfig = globFiles(path.resolve(__dirname, 'configs'));
const { ConnectorsTypes } = MService;

class Service extends MService {
  constructor(config = {}) {
    //
    super(merge({}, defaultConfig, config));

    // flakeless
    this.flakeless = new Flakeless(this.config.flakeless);

    // connectors
    this.addConnector(ConnectorsTypes.migration, () => this.migrate('knex'));

    // models
    const bookshelf = this.bookshelf = Bookshelf(this.knex);
    bookshelf.plugin(bookshelfUUID, { type: () => this.flakeless.next() });
    this.models = {
      Organization: organizationModelFactory(bookshelf),
    };

    // services
    this.services = {
      organization: new OrganizationService(this),
    };
  }
}

module.exports = Service;
