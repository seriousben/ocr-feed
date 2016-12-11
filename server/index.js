const _ = require('lodash');
const Promise = require('bluebird');
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler');
const express = require('express');
const logger = require('winston');

const { setupDatabase, } = require('./db');
const messagesRouter = require('./messages');

const app = exports.app = express();
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('HI')
  // render index.html
});

// Routers
app.use('/messages', messagesRouter);

app.use(errorHandler)

if (!module.parent) {
  Promise.resolve()
    .then(() => setupDatabase())
    .then(() => {
      app.listen(3000);
      console.log('Server listening on port 3000');
    })
}
