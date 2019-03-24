'use strict';

const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Pillar = sequelize.define('Pillar', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    title: DataTypes.STRING,
  }, {});

  Pillar.associate = function (models) {
    Pillar.belongsTo(models.Board, { as: 'board' });
  };

  return Pillar;
};
