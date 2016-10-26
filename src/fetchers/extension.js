const Promise = require('bluebird');

module.exports = [
  {
    point: 'postValidate',
    handler: function postValidate(error, result, request) {
      const response = [error, result, request];

      if (error) {
        return response;
      }

      if (request.action.fetcher) {
        return request.action
          .fetcher.call(this, request)
          .return(response);
      }

      if (request.action.fetchers) {
        return Promise
          .bind(this, request.action.fetchers)
          .map(fetcher => fetcher.call(this, request))
          .return(response);
      }

      if (request.action.syncFetchers) {
        return Promise
          .bind(this, request.action.syncFetchers)
          .each(fetcher => fetcher.call(this, request))
          .return(response);
      }

      return Promise.resolve(response);
    },
  },
];
