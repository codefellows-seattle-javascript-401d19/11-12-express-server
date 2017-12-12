'use strict';

process.env.PORT = 8080;

process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const UserAccount = require('../model/userAccount');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/userAccounts`;

const userAccountMockCreate = () => {
  return new UserAccount({
    name: faker.lorem.words(10),
    description: faker.lorem.words(100),
    location: faker.lorem.words(1),
  }).save();
};

describe('/api/userAccounts', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => UserAccount.remove({}));

  describe('POST /api/userAccounts', () => {
    test('should respond with a note and 200 status code if there is no error',  () => {
      const userAccountToPost = {
        name: faker.lorem.words(10),
        description: faker.lorem.words(100),
        location: faker.lorem.words(1),
      };
      return superagent.post(`${apiURL}`)
        .send(userAccountToPost)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });

    test('should respond with a 400 code if we send an incomplete userAccount', () => {
      const userAccountToPost = {
        name: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}`)
        .send(userAccountToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/userAccounts', () => {
    test('should respond with a 200 status code and a single userAccount if userAccount exists', () => {
      let userAccountToTest = null;

      return userAccountMockCreate()
        .then(userAccount => {
          userAccountToTest = userAccount;
          return superagent.get(`${apiURL}/${userAccount._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });

    test('should respond with a 200 status code and all userAccounts if no id is provided', () => {

      return userAccountMockCreate()
        .then(() => {
          console.log('one');
          return userAccountMockCreate();
        })
        .then(() => {
          console.log('two');
          return userAccountMockCreate();
        })
        .then(() => {
          console.log('three');
          return superagent.get(`${apiURL}`)
            .then(response => {
              expect(response.status).toEqual(200);
            });
        });
    });

    test('should respond with a 404 if invalid route is provided AAA', () => {
      return superagent.get(`http://localhost:${process.env.PORT}/invalid/route`)
        .then(Promise.reject)
        .catch(response => {
          // console.log('AAA', response);
          expect(response.status).toEqual(404);
        });
    });

    test('should respond with 404 status code if the id is incorrect BBB', () => {
      return superagent.get(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch(response => {
          // console.log('BBB', response);
          expect(response.status).toEqual(404);
        });
    });
  });
});
