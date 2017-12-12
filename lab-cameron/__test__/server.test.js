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
          expect(response.body.name).toEqual(userAccountToTest.name);
          expect(response.body.description).toEqual(userAccountToTest.description);
          expect(response.body._id).toEqual(userAccountToTest._id.toString());
        });
    });

    test('should respond with a 200 status code and all userAccounts if no id is provided', () => {
      const userAccountArrayToTest = [];

      return userAccountMockCreate()
        .then(userAccount => {
          userAccountArrayToTest.push(userAccount);
          return userAccountMockCreate();
        })
        .then(userAccount => {
          userAccountArrayToTest.push(userAccount);
          return userAccountMockCreate();
        })
        .then(userAccount => {
          userAccountArrayToTest.push(userAccount);
          return superagent.get(`${apiURL}`)
            .then(response => {
              expect(response.status).toEqual(200);

              expect(response.body[0].name).toEqual(userAccountArrayToTest[0].name);
              expect(response.body[0].description).toEqual(userAccountArrayToTest[0].description);
              expect(response.body[0]._id).toEqual(userAccountArrayToTest[0]._id.toString());

              expect(response.body[1].name).toEqual(userAccountArrayToTest[1].name);
              expect(response.body[1].description).toEqual(userAccountArrayToTest[1].description);
              expect(response.body[1]._id).toEqual(userAccountArrayToTest[1]._id.toString());

              expect(response.body[2].name).toEqual(userAccountArrayToTest[2].name);
              expect(response.body[2].description).toEqual(userAccountArrayToTest[2].description);
              expect(response.body[2]._id).toEqual(userAccountArrayToTest[2]._id.toString());
            });
        });
    });

    test('should respond with a 404 if invalid route is provided', () => {
      return superagent.get(`http://localhost:${process.env.PORT}/invalid/route`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
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

  describe('DELETE /api/userAccounts/:id', () => {
    test('should delete a single user if valid id is provided', () => {
      return userAccountMockCreate()
        .then(userAccount => {
          return superagent.delete(`${apiURL}/${userAccount._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('should respond with 404 status code if id does not exist', () => {
      return superagent.delete(`${apiURL}/nonexistentId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/userAccounts/', () => {
    test('should respond with 400 status code if no id is provided', () => {
      return superagent.delete(`${apiURL}`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });
});
