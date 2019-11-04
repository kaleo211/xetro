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
    end: DataTypes.DATE,
  }, {});

  Item.associate = (models) => {
    Item.belongsTo(models.Group, { as: 'group', foreignKey: 'groupID' });
    Item.belongsTo(models.Board, { as: 'board', foreignKey: 'boardID' });
    Item.belongsTo(models.Pillar, { as: 'pillar', foreignKey: 'pillarID' });
    Item.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerID' });
    Item.hasMany(models.Action, { as: 'actions', foreignKey: 'itemID' });
  };

  return Item;
};
