const Sequelize = require('sequelize');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    title: DataTypes.STRING,
    stage: {
      type: DataTypes.STRING,
      defaultValue: 'created',
    },
  }, {});

  Action.associate = (models) => {
    Action.belongsTo(models.Group, { as: 'group', foreignKey: 'groupID' });
    Action.belongsTo(models.Board, { as: 'board', foreignKey: 'boardID' });
    Action.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerID' });
    Action.belongsTo(models.Item, { as: 'item', foreignKey: 'itemID' });
  };

  return Action;
};
