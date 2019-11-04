const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const config = require('config');
const microsoftRouter = require('./routers/microsoft');
const groupRouter = require('./routers/group');
const userRouter = require('./routers/user');
const boardRouter = require('./routers/board');
const pillarRouter = require('./routers/pillar');
const itemRouter = require('./routers/item');
const actionRouter = require('./routers/action');

const server = express();

const model = require('./models');

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

server.use('/callback', microsoftRouter);
server.use('/groups', isAuthenticated, groupRouter);
server.use('/users', isAuthenticated, userRouter);
server.use('/boards', isAuthenticated, boardRouter);
server.use('/pillars', isAuthenticated, pillarRouter);
server.use('/items', isAuthenticated, itemRouter);
server.use('/actions', isAuthenticated, actionRouter);

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
server.use(express.static('dist'));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.warn('Xetro is listenning on port:', port);
});

module.exports = server;
