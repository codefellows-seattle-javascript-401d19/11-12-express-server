'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const logger = require('../lib/logger');
const faker = require('faker');
const Cat = require('../model/cat');

const PORT = process.env.PORT;

const __API_URL__ = `http://localhost:${PORT}/api/cats`;

const createFakeKitten = () => {
  return new Cat({
    name : faker.lorem.words(1),
    says : faker.lorem.words(10),
  }).save();
};

describe('/api/cats', () => {
  beforeEach(server.start);
  afterEach(server.stop);
  afterEach(() => Cat.remove({}));

  // WORKING
  describe('POST /api/cats', () => {
    test('POST should respond with 200 status code and a body if no errors', () => {
      let someCat = {
        name : faker.lorem.words(1),
        says : faker.lorem.words(10),
      };
      return superagent.post(`${__API_URL__}`)
        .send(someCat)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(someCat.name);
          expect(response.body.says).toEqual(someCat.says);
          expect(response.body.birthday).toBeTruthy();
          expect(response.body._id).toBeTruthy();
        })
        .catch(error => {
          logger.log('error', error);
        });
    });
    // WORKING
    test('POST should respond with 400 if no body or invalid body request', () => {
      return superagent.post(`${__API_URL__}`)
        // .then(response => Promise.reject(response))
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/cats', () => {

    test('GET should respond with 200 status code and cat if no errors when URL includes cat id; checking that a known value that is expected is returned', () => {
      let catTest = null;

      createFakeKitten()
        .then(cat => {
          catTest = cat;
          console.log('cat._id', cat._id);
          return superagent.get(`${__API_URL__}/${cat._id}`);
        })
        .then(response => {
          console.log('returned in get');
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(catTest._id);
          expect(response.body.name).toEqual(catTest.name);
          expect(response.body.says).toEqual(catTest.says);
          expect(response.body.birthday).toBeTruthy();
        })
        .catch(error => {
          console.log('bad get request');
          logger.log('error', error);
        });
    });

    test('GET should respond with 200 if a general request is passed; checking that an expected array is returned', () => {
      createFakeKitten()
        .then(() => createFakeKitten())
        .then(() => createFakeKitten())
        .then(() => superagent.get(`${__API_URL__}`))
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(3);
        })
        .catch(error => console.log('hey bad get no id', error));
    });

    // WORKING
    test('GET should respond with 404 if the id queried does not exist', () => {
      return superagent.get(`${__API_URL__}/5a2f38171865f60a35e145ff`)
        // .then(response => Promise.reject(response))
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

  });

  //WORKING
  describe('DELETE /api/cats', () => {

    test('DELETE should respond with a 400 message if no id provided', () => {
      return superagent.delete(`${__API_URL__}`)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('DELETE should respond with a 204 message if successful', () => {
      createFakeKitten()
        .then(cat => {
          return superagent.del(`${__API_URL__}/${cat._id}`);
        })
        .then(response => {
          console.log('delete then');
          expect(response.status).toEqual(234);
        })
        .catch(error =>{
          console.log('delete catch; delete not working');
          logger.log('error', 'bad API request');
          logger.log('error', error);
        });
    });
  });
});
