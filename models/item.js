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
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stage: {
      type: DataTypes.STRING,
      defaultValue: 'created',
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'item',
    },
    end: DataTypes.DATE,
  }, {});

  Item.associate = function (models) {
    Item.belongsTo(models.Group, { as: 'group' });
    Item.belongsTo(models.Pillar, { as: 'pillar' });
    Item.belongsTo(models.User, { as: 'owner' });
    Item.belongsTo(Item, { as: 'item' })
  };

  return Item;
};
