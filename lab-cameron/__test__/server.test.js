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
  });
});
