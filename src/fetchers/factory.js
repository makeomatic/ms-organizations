const Errors = require('common-errors');

const defaultOptions = {
  require: true,
  key: {
    // modelKey: requestKey
    id: 'id',
  },
  setTo: 'model',
};

const keysReducer = (keys, request) => (query, key) => {
  const requestKey = keys[key];
  const requestValue = request[requestKey];

  if (requestValue === undefined) {
    throw new Errors.NotFoundError(`Key '${requestKey}' not found in request`);
  }

  query[key] = requestValue;

  return query;
};

module.exports = function factory(modelName, options = {}) {
  return function fetcher(request) {
    const Model = this.bookshelf.model(modelName);
    const settings = Object.assign({}, defaultOptions, options);

    if (Model === undefined) {
      throw new Errors.ArgumentError('model');
    }

    const query = Object
      .keys(settings.key)
      .reduce(keysReducer(settings.key, request.params), {});

    return Model
      .forge(query)
      .fetch()
      .then((value) => {
        if (value === null && settings.require) {
          throw new Errors.NotFoundError(`Entity '${modelName}' not found`);
        }

        return value;
      })
      .tap(value => (request[settings.setTo] = value));
  };
};
