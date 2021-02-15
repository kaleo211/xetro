import config from 'config';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

let dbFromVCAP;
try {
  dbFromVCAP = JSON.parse(process.env.VCAP_SERVICES)['p.mysql'][0].credentials;
  dbFromVCAP.dialect = 'mysql';
} catch (err) {
  console.error('error parsing database creds from VCAP_SERVICES');
}

const dbFromConfig = config.get('database');

const dbCreds = dbFromVCAP || dbFromConfig;

const sequelize = new Sequelize(dbCreds.name || dbCreds.database, dbCreds.username, dbCreds.password, {
  host: dbCreds.hostname,
  dialect: dbCreds.dialect || 'mysql',
  port: dbCreds.port || 3306,
  logging: false,
  syncOnAssociation: true,
});

const basename = path.basename(__filename);
const db = {};
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

sequelize.sync({ force: dbFromConfig.forceSync }).then(() => {
  console.warn('database tables created');
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
