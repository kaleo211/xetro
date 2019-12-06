const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  config.get('database.database'),
  config.get('database.username'),
  config.get('database.password'), {
    host: config.get('database.host'),
    dialect: config.get('database.dialect'),
    logging: false,
    syncOnAssociation: true,
  },
);

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    model.sync({ force: false });
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync({ force: false }).then(() => {
  console.warn('database tables are created');
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
