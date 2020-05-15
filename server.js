import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import session from 'express-session';

import actionRouter from './routers/action.js';
import boardRouter from './routers/board.js';
import dellRouter from './routers/dell.js';
import groupRouter from './routers/group.js';
import itemRouter from './routers/item.js';
import pillarRouter from './routers/pillar.js';
import userRouter from './routers/user.js';
import microsoftRouter from './routers/microsoft.js';

import model from './models/index.js';

const server = express();

server.use(session({
  secret: config.get('server.session_secret'),
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  saveUninitialized: true,
}));

const isAuthenticated = (req, res, next) => {
  if (!req.session.me) {
    res.status(403).send('Nice Try! May be Try Login Instead.');
  } else {
    model.User.update(
      { last: new Date() },
      { where: { id: req.session.me.id } },
    );
    next();
  }
};

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());

server.use('/dell', dellRouter);
server.use('/microsoft', microsoftRouter);

server.use('/actions', isAuthenticated, actionRouter);
server.use('/boards', isAuthenticated, boardRouter);
server.use('/groups', isAuthenticated, groupRouter);
server.use('/items', isAuthenticated, itemRouter);
server.use('/pillars', isAuthenticated, pillarRouter);
server.use('/users', isAuthenticated, userRouter);

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
server.use(express.static('dist'));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.warn('Xetro is listenning on port:', port);
});

export default server;
