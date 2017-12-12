'use strict';

// vinicio - this is for express
process.env.PORT = 5000;
// vinicio - this is for mongo
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const planet = require('../model/planet');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/planets`;

const fakePlanet = () => {
  return new planet({
    name : faker.address.longitude(),
    content : faker.lorem.words(10),
  }).save();
};


describe('/api/planets', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => planet.remove({}));

  describe('POST /api/planets', () => {
    test('should respond with a planet and 200 status code if there is no error', () => {
      let planetToPost = {
        name: faker.address.longitude(),
        content : faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}`)
        .send(planetToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.discoverDate).toBeTruthy();

          expect(response.body.name).toEqual(planetToPost.name);
          expect(response.body.content).toEqual(planetToPost.content);
        });
    });
    test('should respond with a 400 code if we send an incomplete planet', () => {
      let planetToPost = {
        content : faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}`)
        .send(planetToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/planets', () => {
    test('should respond with 200 status code if there is no error', () => {
      let planetToTest = null;

      fakePlanet()
        .then(planet => {
          //vinicio - no error checking for now
          planetToTest = planet;
          return superagent.get(`${apiURL}/${planet._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(planetToTest._id.toString());
          expect(response.body.discoverDate).toBeTruthy();

          expect(response.body.name).toEqual(planetToTest.name);
          expect(response.body.content).toEqual(planetToTest.content);
        });
    });
    test('should respond with 404 status code if there id is incorrect', () => {
      return superagent.get(`${apiURL}/gregorAndTheHound`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});