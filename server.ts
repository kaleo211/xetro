import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';

import { Server, Socket } from 'socket.io';
import http from 'http';

import actionRouter from './routers/action';
import boardRouter from './routers/board';
import dellRouter from './routers/dell';
import groupRouter from './routers/group';
import itemRouter from './routers/item';
import pillarRouter from './routers/pillar';
import userRouter from './routers/user';
import socketRouter from './routers/socket';
import { Database } from './models/index';
import { User } from './models/user';
import { Sequelize } from 'sequelize/types';
import { Service } from 'services';

let dbCreds;
try {
  dbCreds = JSON.parse(process.env.VCAP_SERVICES)['p.mysql'][0].credentials;
} catch (err) {
  console.error('error parsing database creds from VCAP_SERVICES');
  dbCreds = config.get('database');
}

const sequelize = new Sequelize(dbCreds.name || dbCreds.database, dbCreds.username, dbCreds.password, {
  host: dbCreds.hostname,
  dialect: dbCreds.dialect || 'mysql',
  port: dbCreds.port || 3306,
  logging: dbCreds.logging || false,
});

const database = new Database(sequelize);

sequelize.sync({ force: dbCreds.forceSync || false }).then(() => {
  console.warn('database tables created');
});

export const service = new Service(database);



const app = express();

app.use(morgan(':method :status :url :response-time'));

app.use(session({
  secret: config.get('server.sessionSecret'),
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

app.use('/dell', dellRouter);
app.use('/socket', isAuthenticated, socketRouter);
app.use('/actions', isAuthenticated, actionRouter);
app.use('/boards', isAuthenticated, boardRouter);
app.use('/groups', isAuthenticated, groupRouter);
app.use('/items', isAuthenticated, itemRouter);
app.use('/pillars', isAuthenticated, pillarRouter);
app.use('/users', isAuthenticated, userRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use(express.static('dist'));

const port = process.env.PORT || 8080;
// server.listen(port, () => {
//   console.warn('Xetro is listenning on port:', port);
// });

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
