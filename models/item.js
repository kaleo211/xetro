'use strict';

const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    title: DataTypes.STRING,
  }, {});

  Item.associate = function (models) {
    Item.belongsTo(models.Group, { as: 'group' });
    Item.belongsTo(models.Pillar, { as: 'pillar' });
    Item.belongsTo(models.User, { as: 'owner' });
  };

  return Item;
};
