const defaultParams = {
  roles: [],
};

const sortReducer = (query, sort) => query.orderBy(sort);

class Member {
  constructor(application) {
    this.Model = application.bookshelf.model('Member');
  }

  create(params) {
    const attributes = Object.assign({}, defaultParams, params);

    if (attributes.roles === undefined) {
      attributes.roles = [];
    }

    return this.Model
      .forge()
      .save(attributes);
  }

  fetchAll(params) {
    const { sort, filter, page, pageSize } = params;
    const query = this.Model.where(filter);
    const model = sort.reduce(sortReducer, query);

    return model
      // not fetchPage because composite key doesn't work
      // https://github.com/tgriesser/bookshelf/pull/1395
      .query((queryBuilder) => {
        queryBuilder.limit(pageSize);
        queryBuilder.offset(pageSize * (page - 1));
      })
      .fetchAll();
  }
}

module.exports = Member;
