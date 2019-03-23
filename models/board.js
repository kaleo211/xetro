'use strict';

const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    name: DataTypes.STRING,
    stage: DataTypes.STRING,
  }, {});

  Board.associate = function (models) {
    Board.belongsTo(models.Group, { as: 'group' });
    Board.belongsTo(models.User, { as: 'facilitator' });
  };

  return Board;
};
