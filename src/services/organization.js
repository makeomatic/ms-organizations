const transliteration = require('transliteration');

const { slugify } = transliteration;
const defaultParams = {
  enabled: false,
  meta: {},
};

class Organization {
  constructor(application) {
    this.Model = application.models.Organization;
  }

  create(params) {
    const attributes = Object.assign({}, params, defaultParams);

    if (attributes.alias === undefined) {
      attributes.alias = slugify(attributes.name);
    }

    const organization = new this.Model(attributes);

    return organization.save();
  }
}

module.exports = Organization;
