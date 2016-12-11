const chai = require('chai');
const expect = require('chai').expect;
const Promise = require('bluebird');
const request = require('supertest');

chai.use(require('dirty-chai'));

const { setupDatabase, } = require('../db');
const { app, } = require('../index');

describe('api', function() {
  beforeEach(function() {
    return setupDatabase();
  });

  describe('message api', function() {
    function expectMessageProperties(message) {
      expect(message).to.have.property('id');
      expect(message).to.have.property('content');
      expect(message).to.have.property('createdAt');
      expect(message).to.have.property('updatedAt');
    }

    it('crud', function() {
      return Promise.resolve().then(() => {
        return request(app)
          .get('/messages')
          .then((res) => {
            expect(res.body.data).to.be.empty();
          });
      }).then(() => {
        return request(app)
          .post('/messages')
          .send({
            content: 'content',
          })
          .then((res) => {
            const message = res.body.data;
            expectMessageProperties(message);
            expect(message.content).to.equal('content');
          });
      }).then(() => {
        return request(app)
          .get('/messages')
          .then((res) => {
            expect(res.body.data).to.have.lengthOf(1);
            const message = res.body.data[0];
            expectMessageProperties(message);
            expect(message.content).to.equal('content');
            return message.id;
          });
      }).then((id) => {
        return request(app)
          .patch(`/messages/${id}`)
          .send({
            content: 'updated content',
          })
          .then((res) => {
            const message = res.body.data;
            expectMessageProperties(message);
            expect(message.content).to.equal('updated content');
            return message.id;
          });
      }).then((id) => {
        return request(app)
          .get(`/messages/${id}`)
          .then((res) => {
            const message = res.body.data;
            expectMessageProperties(message);
            expect(message.content).to.equal('updated content');
          });
      }).then(() => {
        return request(app)
          .get('/messages')
          .then((res) => {
            expect(res.body.data).to.have.lengthOf(1);
            const message = res.body.data[0];
            expectMessageProperties(message);
            expect(message.content).to.equal('updated content');
            return message.id;
          });
      }).then((id) => {
        return request(app)
          .delete(`/messages/${id}`)
          .then((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true();
            return id;
          });
      }).then((id) => {
        return request(app)
          .get(`/messages/${id}`)
          .then((res) => {
            expect(res.statusCode).to.equal(404);
          });
      }).then(() => {
        return request(app)
          .get('/messages')
          .then((res) => {
            expect(res.body.data).to.have.lengthOf(0);
          });
      });
    });
  });
});
