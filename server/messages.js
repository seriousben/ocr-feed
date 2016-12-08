const _ = require('lodash');
const Promise = require('bluebird');
const express = require('express');

const { knex, } = require('./db');

function renderKnexSingleQuery(query, req, res, next) {
  Promise.resolve(query)
    .then((data) => { console.log(data); return data; })
    .then((data) => res.json({ data: _.head(data), }))
    .catch(next);
}

function renderKnexQuery(query, req, res, next) {
  Promise.resolve(query)
    .then((data) => res.json({ data, }))
    .catch(next);
}

const router = module.exports = express.Router();

router.get('/', (req, res, next) => {
  // Get all messages
  const query = knex('t_messages')
    .select('id', 'content', 'image_url', 'created_at')
    .orderBy('created_at', 'DESC');

  renderKnexQuery(query, req, res, next);
});
router.post('/', (req, res, next) => {
  // Create message
  const query = knex('t_messages')
    .returning(['id', 'content', 'image_url', 'created_at'])
    .insert(_.pick(req.body, [
      'content', 'image_url'
    ]));

  renderKnexSingleQuery(query, req, res, next);
});
router.get('/:id', (req, res, next) => {
  // Get message by id
  const query = knex('t_messages')
    .select('id', 'content', 'image_url', 'created_at')
    .where('id', req.params.id);

  renderKnexSingleQuery(query, req, res, next);
});
router.patch('/:id', (req, res, next) => {
  // Update messages
  const query = knex('t_messages')
    .returning(['id', 'content', 'image_url', 'created_at'])
    .update(_.pick(req.body, ['content', 'image_url']))
    .where('id', req.params.id);

  renderKnexSingleQuery(query, req, res, next);
});
router.delete('/:id', (req, res, next) => {
  // Delete messages
  const query = knex('t_messages')
    .del()
    .where('id', req.params.id);

  Promise.resolve(query).then(() => res.json({
    success: true,
  })).catch(next);
});
