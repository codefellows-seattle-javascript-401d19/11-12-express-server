'use strict';

process.env.PORT = 7000;

process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const User = require('../model/user');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/users`;

const userMockCreate = () => {
  return new User({
    name: faker.lorem.words(10),
    description: faker.lorem.words(100),
  }).save();
};

describe('/api/users', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => User.remove({}));

  describe('POST /api/users', () => {
    test('should respond with a note and 200 status code if there is no error',  () => {
      const userToPost = {
        name: faker.lorem.words(10),
        description: faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(userToPost)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });

    test('should respond with a 400 code if we send an incomplete user', () => {
      const userToPost = {
        name: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}`)
        .send(userToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/users', () => {
    test('should respond with a 200 status code if there is no error', () => {
      let userToTest = null;

      userMockCreate()
        .then(user => {
          userToTest = user;
          return superagent.get(`${apiURL}/${user._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(userToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(userToTest.name);
          expect(response.body.description).toEqual(userToTest.description);
        });
    });

    test('should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
