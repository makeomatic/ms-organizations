const transliteration = require('transliteration');

const { slugify } = transliteration;

class Organization {
  constructor(application) {
    this.Model = application.models.Organization;
  }

  create(params) {
    const attributes = Object.assign(params);

    if (attributes.alias === undefined) {
      attributes.alias = slugify(attributes.name);
    }

    attributes.createdAt = new Date();

    const organization = new this.Model(attributes);

    return organization.save();
  }
}

module.exports = Organization;
