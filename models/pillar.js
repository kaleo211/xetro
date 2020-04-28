import Sequelize from 'sequelize';
import uuid from 'uuid/v4';

module.exports = (sequelize, DataTypes) => {
  const Pillar = sequelize.define('Pillar', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    title: DataTypes.STRING,
    position: DataTypes.INTEGER,
  }, {});

  Pillar.associate = (models) => {
    Pillar.belongsTo(models.Board, { as: 'board', foreignKey: 'boardID' });
    Pillar.hasMany(models.Item, { as: 'items', foreignKey: 'pillarID' });
  };

  return Pillar;
};
