import { Config } from './config';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import * as path from 'path';
import session from 'express-session';
import { Server, Socket } from 'socket.io';
import * as http from 'http';
import { Dialect, Sequelize } from 'sequelize';

import { Database } from './models/index';
import { User } from './models/user';
import { Service } from './services/index';
import { Routers } from './routers/index';

const dbConfig = Config.get().database;
const sequelize = new Sequelize(dbConfig.database || dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect as Dialect,
  port: dbConfig.port || 3306,
  logging: dbConfig.logging,
});
const database = new Database(sequelize);
export const service = new Service(database);
export const routers = new Routers(service);

const app = express();
app.use(express.json());
app.use(morgan(':method :status :url :response-time'));

app.use(session({
  secret: Config.get().app.sessionSecret,
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  saveUninitialized: true,
}));

declare module 'express-session' {
  interface SessionData {
    me: User;
  }
}

const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.me) {
    res.status(403).send('Nice Try! May be Try Login Instead.');
  } else {
    database.user.update(
      { last: new Date() },
      { where: { id: req.session.me.id } },
    );
    next();
  }
};

app.use(cookieParser());

app.use('/dell', routers.dell.router);
app.use('/socket.io', isAuthenticated, routers.socket.router);
app.use('/tasks', isAuthenticated, routers.task.router);
app.use('/boards', isAuthenticated, routers.board.router);
app.use('/groups', isAuthenticated, routers.group.router);
app.use('/items', isAuthenticated, routers.item.router);
app.use('/pillars', isAuthenticated, routers.pillar.router);
app.use('/users', isAuthenticated, routers.user.router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static('dist'));

const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);

let interval: NodeJS.Timeout;

io.on('connection', (socket: Socket) => {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  })
});

server.listen(port, () => console.log(`listening on port ${port}`));

const getApiAndEmit = (socket: Socket) => {
  const response = new Date();
  socket.emit('FromAPI', response);
}

export default server;
