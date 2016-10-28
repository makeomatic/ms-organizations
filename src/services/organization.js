const omit = require('lodash/omit');
const transliteration = require('transliteration');

const { slugify } = transliteration;
const defaultParams = {
  enabled: false,
  meta: {},
};
const fieldPartsReducer = (query, part) => {
  if (part === 'meta') {
    return `${query}${part}`;
  }

  return `${query}->>'${part}'`;
};
const sortReducer = (query, sort) => {
  if (sort.slice(0, 5) === 'meta.' || sort.slice(0, 6) === '-meta.') {
    let field = sort;
    let direction = 'ASC';

    if (field.slice(0, 1) === '-') {
      field = field.slice(1);
      direction = 'DESC';
    }

    const parts = field.split('.');
    const jsonField = parts.reduce(fieldPartsReducer, '');

    return query.query((queryBuilder) => {
      queryBuilder.orderByRaw(`${jsonField} ${direction}`);
    });
  }

  return query.orderBy(sort);
};

class Organization {
  constructor(application) {
    this.Model = application.bookshelf.model('Organization');
  }

  create(params) {
    const attributes = Object.assign({}, defaultParams, params);

    if (attributes.alias === undefined) {
      attributes.alias = slugify(attributes.name);
    }

    return this.Model
      .forge()
      .save(attributes);
  }

  fetchAll(params) {
    const { sort, filter, page, pageSize } = params;
    const query = this.Model.query((queryBuilder) => {
      const where = omit(filter, ['meta']);

      queryBuilder.where(where);

      if (filter.meta) {
        queryBuilder.where('meta', '@>', JSON.stringify(filter.meta));
      }
    });
    const model = sort.reduce(sortReducer, query);

    return model.fetchPage({ page, pageSize });
  }
}

module.exports = Organization;
