module.exports = {
  tableName: 'members',
  // composite key doesn't work
  idAttribute: ['organizationId', 'userId'],
  hasTimestamps: ['createdAt', 'updatedAt'],
  organization: function getRelation() {
    return this.belongsTo('Organization');
  },
};
