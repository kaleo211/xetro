import Sequelize from 'sequelize';
import uuid from 'uuid/v4';

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
    chat: DataTypes.STRING,
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timer: DataTypes.INTEGER,
  }, {});

  Board.associate = (models) => {
    Board.belongsTo(models.Group, { as: 'group', foreignKey: 'groupID' });
    Board.hasMany(models.Pillar, { as: 'pillars', foreignKey: 'boardID' });
    Board.hasMany(models.Action, { as: 'actions', foreignKey: 'boardID' });
  };

  return Board;
};
