'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Beer = require('../model/beer');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/beers`;

const beerMockCreate = () => {
  return new Beer({
    brewery : faker.lorem.words(10),
    beer : faker.lorem.words(100),
    style : faker.lorem.words(20),
  }).save();
};


describe('/api/beers', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Beer.remove({}));

  describe('POST /api/beers', () => {
    test('should respond with a beer and 200 status code if there is no error', () => {
      let beerToPost = {
        brewery : faker.lorem.words(10),
        beer : faker.lorem.words(100),
        style : faker.lorem.words(20),
      };
      return superagent.post(`${apiURL}`).send(beerToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.brewery).toEqual(beerToPost.brewery);
          expect(response.body.beer).toEqual(beerToPost.beer);
        });
    });
    test('should respond with a 400 code if we send an incomplete beer', () => {
      let beerToPost = {
        beer : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(beerToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/beers', () => {
    test('should respond with 200 status code if there is no error', () => {
      let beerToTest = null;

      beerMockCreate()
        .then(beer => {
          beerToTest = beer;
          return superagent.get(`${apiURL}/${beer._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(beerToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          expect(response.body.brewery).toEqual(beerToTest.brewery);
          expect(response.body.beer).toEqual(beerToTest.beer);
        });
    });
    test('should respond with 404 status code if there id is incorrect', () => {
      return superagent.get(`${apiURL}/someid`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/beers', () => {
    test('should respond with 204 status code if the beer was deleted', () => {
      beerMockCreate()
        .then(beer => {
          console.log(`${apiURL}/${beer._id}`);
          return superagent.delete(`${apiURL}/${beer._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
