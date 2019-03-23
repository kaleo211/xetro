var express = require('express');
var server = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var config = require('config');
var microsoftRouter = require('./routers/microsoft');
var groupRouter = require('./routers/group');
var userRouter = require('./routers/user');
var boardRouter = require('./routers/board');

server.use(session({
  secret: config.get('server.session_secret'),
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  saveUninitialized: true,
}));

var isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    res.status(403).send('You are not authorized to view this page');
  } else {
    next();
  }
}

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser())

server.use('/callback', microsoftRouter);
server.use('/groups', isAuthenticated, groupRouter);
server.use('/users', isAuthenticated, userRouter);
server.use('/boards', isAuthenticated, boardRouter);

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
server.use(express.static('dist'));

var port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('Xetro is listenning on port ' + port);
});

module.exports = server;
