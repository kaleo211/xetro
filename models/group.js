const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    name: DataTypes.STRING,
  }, {});

  Group.associate = (models) => {
    Group.belongsToMany(models.User, { as: 'members', through: 'GroupMember', foreignKey: 'groupID' });
    Group.hasMany(models.Board, { as: 'boards', foreignKey: 'groupID' });
    Group.hasMany(models.Action, { as: 'actions', foreignKey: 'groupID' });
  };

  return Group;
};
