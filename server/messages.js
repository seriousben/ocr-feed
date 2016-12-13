const _ = require('lodash');
const Promise = require('bluebird');
const express = require('express');
const errors = require('http-errors');
const tesseract = require('tesseract_native');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ocr = new tesseract.OcrEio();

const { knex, } = require('./db');
const { isPalindrome, TYPES: palindromImplTypes } = require('./palindrome');

function deserializeFromApi(data) {
  // TODO: Make recursive
  if (_.isArray(data)) {
    return _.map(data, deserializeFromApi);
  }

  return _.mapKeys(data, (v, k) => _.snakeCase(k));
}

function serializeToApi(data) {
  // TODO: Make recursive
  if (_.isArray(data)) {
    return _.map(data, serializeToApi);
  }

  return _.mapKeys(data, (v, k) => _.camelCase(k));
}

function renderKnexSingleQuery(query, req, res, next) {
  Promise.resolve(query)
    .then((data) => {
      if (_.isEmpty(data)) {
        throw new errors.NotFound();
      }
      return data;
    })
    .then((data) => res.json({ data: serializeToApi(_.head(data)), }))
    .catch(next);
}

function renderKnexQuery(query, req, res, next) {
  Promise.resolve(query)
    .then((data) => res.json({ data: serializeToApi(data), }))
    .catch(next);
}

const router = module.exports = express.Router();

router.use((req, res, next) => {
  // TODO: Check accept headers for application/json
  if (req.body) {
    req.body = deserializeFromApi(req.body);
  }
  return next();
});

router.get('/', (req, res, next) => {
  // Get all messages
  const query = knex('t_messages')
    .select('id', 'content', 'image_url', 'created_at', 'updated_at')
    .orderBy('created_at', 'DESC');

  renderKnexQuery(query, req, res, next);
});

function fileToText(file) {
  return Promise.fromCallback((cb) => {
    ocr.ocr(file.buffer, cb)
  });
}

router.post('/', upload.single('file'), (req, res, next) => {
  // Create message
  Promise.resolve()
    .then(() => {
      if (!req.file) {
        return null;
      }
      return fileToText(req.file);
    })
    .then((text) => {
      const message = _.pick(req.body, [
        'content', 'imageUrl'
      ]);
      if (text) {
        message.content = _.trim(_.trim(text), '\n');
      }
      message.created_at = new Date();
      message.updated_at = new Date();

      const query = knex('t_messages')
        .returning(['id', 'content', 'image_url', 'created_at', 'updated_at'])
        .insert(message);

      renderKnexSingleQuery(query, req, res, next);
    });
});
router.get('/:id', (req, res, next) => {
  // Get message by id
  const query = knex('t_messages')
    .select('id', 'content', 'image_url', 'created_at', 'updated_at')
    .where('id', req.params.id);

  renderKnexSingleQuery(query, req, res, next);
});

// Not Restful :) But fun
router.get('/:id/isPalindrome', (req, res, next) => {
  // Check if a message is a palindrome
  const implType = req.query.algo || _.sample(palindromImplTypes);

  const query = knex('t_messages')
    .select('id', 'content', 'image_url', 'created_at', 'updated_at')
    .where('id', req.params.id);

  Promise.resolve(query).then((messages) => {
    if (_.isEmpty(messages)) {
      throw new errors.NotFound();
    }
    return isPalindrome(messages[0].content, implType);
  }).then((isPalindrome) => {
    res.json({
      implType,
      isPalindrome,
    });
  }).catch(next);
});

router.patch('/:id', (req, res, next) => {
  // Update messages
  const message = _.pick(req.body, [
    'content', 'image_url'
  ]);
  message.updated_at = new Date();

  const query = knex('t_messages')
    .returning(['id', 'content', 'image_url', 'created_at', 'updated_at'])
    .update(message)
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
