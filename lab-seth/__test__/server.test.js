'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Planet = require('../model/planet');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/planets`;

const planetMockupCreator = () => {
  return new Planet({
    name: `K-123456`,
    content  : 'words',
  }).save();
};

describe('api/planets', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Planet.remove({}));

  describe('POST /api/planets', () => {
    test('should respond with a planet and a 200 status code if there is no error', () => {
      let planetToPost = {
        name: `K-123456`,
        content: 'words',
      };
      return superagent.post(`${apiURL}`)
        .send(planetToPost)
        .then(response => {
          // console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();

          expect(response.body.name).toEqual(planetToPost.name);
          expect(response.body.content).toEqual(planetToPost.content);
        });
    });
    test('should respond with a 400 code if we send an incomplete planet', () => {
      let planetToPost = {
        content: 'words',
      };
      return superagent.post(`${apiURL}`)
        .send(planetToPost)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.status);
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/planets', () => {
    test('should respond with a 200 status code if there is no error', () => {
      let planetToTest = null;

      return planetMockupCreator()
        .then(planet => {
          planetToTest = planet;
          return superagent.get(`${apiURL}/${planet._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(planetToTest._id.toString());

          expect(response.body.name).toEqual(planetToTest.name);
          expect(response.body.content).toEqual(planetToTest.content);          
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/planets/:id', () => {
    test('should respond with a 204 status code if there is no error', () => {
      return planetMockupCreator()
        .then(planet => {
          return superagent.delete(`${apiURL}/${planet._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      
      return superagent.delete(`${apiURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.status);
          expect(response.status).toEqual(404);
        });
    });
  });
});