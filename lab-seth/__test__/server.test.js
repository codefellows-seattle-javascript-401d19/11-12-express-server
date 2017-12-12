'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const planet = require('../model/planet');
const server = require('../lib/server');

const APIURL = `http://localhost:${process.env.PORT}/api/planets`;

const planetMockupCreator = () => {
  return new planet({
    name: `K-${faker.random.alphaNumeric(4)}`,
    content  : faker.lorem.words(10),
  }).save();
};

describe('api/planets', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(() => planet.remove({}));

  describe('POST /api/planets', () => {
    test('should respond with a planet and a 200 status code if there is no error', () => {
      let planetToPost = {
        name: `K-${faker.random.alphaNumeric(4)}`,
        content: faker.lorem.words(10),
      };
      return superagent.post(`${APIURL}`)
        .send(planetToPost)
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.discoverDate).toBeTruthy();

          expect(response.body.name).toEqual(planetToPost.name);
          expect(response.body.content).toEqual(planetToPost.content);
        });
    });
    test('should respond with a 400 code if we send an incomplete planet', () => {
      let planetToPost = {
        content: faker.lorem.words(10),
      };
      return superagent.post(`${APIURL}`)
        .send(planetToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/planets', () => {
    test('should respond with a 200 status code if there is no error', () => {
      let planetToTest = null;

      planetMockupCreator()
        .then(planet => {
          planetToTest = planet;
          return superagent.get(`${APIURL}/${planet._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(planetToTest._id.toString());
          expect(response.body.discoveDate).toBeTruthy();

          expect(response.body.name).toEqual(planetToTest.name);
          expect(response.body.content).toEqual(planetToTest.content);          
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${APIURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});