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
    initial: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return this.get('firstName').charAt(0).toUpperCase() + this.get('lastName').charAt(0).toUpperCase();
      },
    },
    email: DataTypes.STRING,
    microsoftID: DataTypes.STRING,
    last: DataTypes.DATE,
    active: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      get() {
        const gap = new Date().getTime() - new Date(this.get('last')).getTime();
        return gap < 3 * 60 * 1000;
      },
    },
    accessToken: DataTypes.STRING(2000),
  }, {});

  User.associate = (models) => {
    User.belongsToMany(models.Group, { as: 'groups', through: 'GroupMember' });
    User.hasMany(models.Item, { as: 'actions', foreignKey: 'ownerId' });
  };

  return User;
};
