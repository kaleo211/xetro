var express = require('express');
var server = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');

server.use(session({
  secret: 'Xetro',
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser())


server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})
server.use(express.static('dist'))


var port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('Magic happens on port ' + port);
});

module.exports = server;
