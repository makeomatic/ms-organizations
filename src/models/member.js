module.exports = {
  tableName: 'members',
  // composite key doesn't work
  idAttribute: null,
  hasTimestamps: ['createdAt', 'updatedAt'],
  organization: function getRelation() {
    return this.belongsTo('Organization');
  },
};
