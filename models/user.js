'use strict';

const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    microsoftID: DataTypes.STRING,
  }, {});

  User.associate = function (models) {
    User.belongsToMany(models.Group, { as: 'groups', through: 'GroupMember' });
    User.hasMany(models.Item, { as: 'actions', foreignKey: 'ownerId' });
  };

  return User;
};
