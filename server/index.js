const _ = require('lodash');
const Promise = require('bluebird');
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler');
const express = require('express');
const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING || 'postgres://postgres@localhost:5432/postgres',
});
const logger = require('winston');
const app = express();

function setupDb() {
  return Promise.resolve()
    .then(() => knex.raw(`DROP TABLE IF EXISTS t_messages CASCADE`))
    .then(() => knex.schema.createTable('t_messages', function(table) {
      table.increments();
      table.string('content');
      table.string('image_url');
      table.timestamps();
    }));
}

function renderKnexSingleQuery(query, req, res, next) {
  Promise.resolve(query)
    .then((data) => res.json({ data: _.head(data), }))
    .catch(next);
}

function renderKnexQuery(query, req, res, next) {
  Promise.resolve(query)
    .then((data) => res.json({ data, }))
    .catch(next);
}

const msgRouter = express.Router();
msgRouter.get('/', (req, res, next) => {
  // Get all messages
  const query = knex('messages')
    .select('id', 'content', 'image_url', 'created_at')
    .orderBy('created_at DESC');

  renderKnexQuery(query, req, res, next);
});
msgRouter.post('/', (req, res, next) => {
  // Create message
  const query = knex('messages')
    .returning(['id', 'content', 'image_url', 'created_at'])
    .insert(_.pick(req.body, [
      'content', 'image_url'
    ]));

  renderKnexSingleQuery(query, req, res, next);
});
msgRouter.get('/:id', (req, res, next) => {
  // Get message by id
  const query = knex('messages')
    .select('id', 'content', 'image_url', 'created_at')
    .where('id', req.params.id);

  renderKnexSingleQuery(query, req, res, next);
});
msgRouter.patch('/:id', (req, res, next) => {
  // Update messages
  const query = knex('messages')
    .returning(['id', 'content', 'image_url', 'created_at'])
    .update(_.pick(req.body, ['content', 'image_url']))
    .where('id', req.params.id);

  renderKnexSingleQuery(query, req, res, next);
});
msgRouter.del('/:id', (req, res, next) => {
  // Delete messages
  const query = knex('messages')
    .del()
    .where('id', req.params.id);

  Promise.resolve(query).then(() => res.json({
    success: true,
  })).catch(next);
});

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(errorHandler)

app.get('/', (req, res) => {
  // render index.html
});

app.use('/messages', messageRouter);

exports.setupDatabase = setupDatabase;
exports.knex = knex;

if (!module.parent) {
  Promise.resolve()
    .then(() => setupDatabase())
    .then(() => {
      app.listen(3000);
      console.log('Server listening on port 3000');
    })
}
