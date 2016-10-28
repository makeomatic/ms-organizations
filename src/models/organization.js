module.exports = {
  tableName: 'organizations',
  uuid: true,
  hasTimestamps: ['createdAt', 'updatedAt'],
  members: function getRelation() {
    return this.hasMany('Member');
  },
};
