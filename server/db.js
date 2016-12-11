const Promise = require('bluebird');

const knex = exports.knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING || 'postgres://postgres@localhost:5432/postgres',
});

exports.setupDatabase = function setupDatabase() {
  return Promise.resolve()
    .then(() => knex.raw(`DROP TABLE IF EXISTS t_messages CASCADE`))
    .then(() => {
      return knex.schema.createTable('t_messages', function(table) {
        table.increments();
        table.string('content');
        table.string('image_url');
        table.timestamps();
      });
    })
    .then(() => console.log('Database ready!'))
}
