'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Hero = require('../model/hero');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/heroes`;

const heroMockCreate = () => {
  return new Hero({
    name : faker.lorem.words(1),
    description : faker.lorem.words(10),
  }).save();
};

describe('/api/heroes', () => {
  beforeAll(server.start);
  // afterAll(server.stop);
  afterEach(() => Hero.remove({}));


  // ==============  POST METHOD ==================

  describe('POST /api/heroes', () => {
    test('should respond with a note and 200 status code if there is no error', () => {
      let heroToPost = {
        name : faker.lorem.words(1),
        description : faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}`)
        .send(heroToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(heroToPost.name);
          expect(response.body.description).toEqual(heroToPost.description);
        });
    });
    test('should respond with a 400 code if we send an incomplete hero', () => {
      let heroToPost = {
        description : faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}`)
        .send(heroToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  // ==============  GET METHOD ==================

  describe('GET /api/heroes', () => {
    test('should respond with code 200 if there is no error', () => {
      let heroToTest = null;

      heroMockCreate()
        .then(hero => {
          heroToTest = hero;
          return superagent.get(`${apiURL}/${hero._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(heroToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(heroToTest.name);
          expect(response.body.description).toEqual(heroToTest.description);
        });
    });
    test('should respond with a 404 status code if their ID is incorrect', () => {
      return superagent.get(`${apiURL}/supercatwoman`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });


  // ==============  DELETE METHOD ==================

  describe('DELETE /api/heroes', () => {
    test('DELETE should respond with code 204 if there is no error', () => {
      let heroToTest = null;

      heroMockCreate()
        .then(hero => {
          heroToTest = hero;
          return superagent.delete(`${apiURL}/${hero._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
  });

});
