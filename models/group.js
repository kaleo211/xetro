'use strict';

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

  Group.associate = function (models) {
    Group.belongsToMany(models.User, { as: 'members', through: 'GroupUser' });
  };

  return Group;
};