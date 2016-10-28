const Bookshelf = require('bookshelf');
const bookshelfUUID = require('bookshelf-uuid');
const Flakeless = require('ms-flakeless');
const { globFiles } = require('ms-conf/lib/load-config');
const inviteModel = require('./models/invite');
const InviteService = require('./services/invite');
const merge = require('lodash/merge');
const MService = require('mservice');
const memberModel = require('./models/member');
const MemberService = require('./services/member');
const organizationModel = require('./models/organization');
const OrganizationService = require('./services/organization');
const path = require('path');
const TokenManager = require('ms-token');

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
    bookshelf.model('Invite', inviteModel);
    bookshelf.model('Member', memberModel);
    bookshelf.model('Organization', organizationModel);

    // services
    this.service('member', MemberService);
    this.service('organization', OrganizationService);

    this.on('plugin:connect:redisCluster', (redis) => {
      // token manager
      const tokenManagerOpts = { backend: { connection: redis } };

      this.tokenManager = new TokenManager(merge({}, this.config.tokenManager, tokenManagerOpts));
      this.service('invite', InviteService);
    });

    this.on('plugin:close:redisCluster', () => {
      this.tokenManager = null;
    });
  }

  service(name, ServiceClass) {
    if (ServiceClass !== undefined) {
      this.services[name] = new ServiceClass(this);
    }

    return this.services[name];
  }
}

module.exports = Service;
