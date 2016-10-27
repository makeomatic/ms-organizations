const Errors = require('common-errors');

const defaultOptions = {
  require: true,
  modelKey: 'id',
  requestKey: 'id',
};

module.exports = function factory(modelName, options = {}) {
  return function fetcher(request) {
    const Model = this.models[modelName];
    const settings = Object.assign({}, defaultOptions, options);
    const requestValue = request.params[settings.requestKey];

    if (Model === undefined) {
      throw new Errors.ArgumentError('model');
    }

    if (requestValue === undefined) {
      throw new Errors.NotFoundError('request', `Key ${settings.requestKey} not found in request`);
    }

    const model = new Model({ [settings.modelKey]: requestValue });

    return model
      .fetch()
      .then((value) => {
        if (value === null && settings.require) {
          throw new Errors.NotFoundError(`Entity #${requestValue} not found`);
        }

        return value;
      })
      .tap(value => (request.model = value));
  };
};
