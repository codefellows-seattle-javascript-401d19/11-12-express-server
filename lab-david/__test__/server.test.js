'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const mountain = require('../model/mountain');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/mountains`;

const mountainMockupCreator = () => {
  return new mountain({
    name : faker.address.county(2),
    state  : faker.address.state(1),
    range : faker.address.county(2),
  }).save();
};

describe('api/mountains', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => mountain.remove({}));

  describe('POST /api/mountains', () => {
    test('should respond with a mountain and a 200 status code if there is no error', () => {
      let mountainToPost = {
        name : faker.address.county(2),
        state : faker.address.state(1),
        range : faker.address.county(2),
      };
      return superagent.post(`${apiURL}`)
        .send(mountainToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(mountainToPost.name);
          expect(response.body.state).toEqual(mountainToPost.state);
          expect(response.body.range).toEqual(mountainToPost.range);
        });
    });
    test('should respond with a 400 code if we send an incomplete mountain', () => {
      let mountainToPost = {
        name : faker.company.bsNoun(2),
      };
      return superagent.post(`${apiURL}`)
        .send(mountainToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/mountains', () => {
    test('should respond with a 200 status code if there is no error', () => {
      let mountainToTest = null;

      mountainMockupCreator()
        .then(mountain => {
          mountainToTest = mountain;
          return superagent.get(`${apiURL}/${mountain._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(mountainToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(mountainToTest.name);
          expect(response.body.state).toEqual(mountainToTest.state);
          expect(response.body.range).toEqual(mountainToTest.range);
          
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/superFakeId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});