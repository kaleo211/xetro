import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from 'config';

import { isBlank } from '../utils/tool';

const basename = path.basename(__filename);
const db = {};

if (isBlank(config.get('database'))) {
  throw new Error('database is not configurated');
}
const database = config.get('database.database');
const username = config.get('database.username');
const host = config.get('database.host');

let password = '';
let dialect = 'mysql';
let force = false;
try { password = config.get('database.password'); } catch (e) {};
try { dialect = config.get('database.dialect'); } catch (e) {};
try { force = config.get('database.force_sync'); } catch (e) {};

const sequelize = new Sequelize(database, username, password,
  {
    host,
    dialect,
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

sequelize.sync({ force }).then(() => {
  console.warn('database tables created');
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


export default db;
