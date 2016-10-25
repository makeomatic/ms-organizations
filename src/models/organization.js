module.exports = bookshelf =>
  bookshelf.Model.extend({
    tableName: 'organizations',
    uuid: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
  });
