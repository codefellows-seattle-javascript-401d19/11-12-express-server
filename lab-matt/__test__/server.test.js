'use strict';

let PORT = process.env.PORT | 3000;
let MONGODB_URI = process.env.PORT | 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Dog = require('../model/dogs');
const server = require('../lib/server');
const log = require('../lib/logger');

const apiURL = `http://localhost:${PORT}/api/dogs`;

const dogMockCreate = () => {
  return new Dog({
    name: faker.name.firstName(),
    legs: faker.random.number({min: 1, max: 4}),
  }).save();
};

describe('/api/dogs', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Dog.remove({}));

  describe('POST /api/dogs', () => {
    test('POST should respond with 200 and data if no error', () => {
      let dogToPost = {
        name: faker.name.firstName(),
        legs: faker.random.number({min: 1, max: 4}),
      };

      return superagent.post(`${apiURL}`)
        .send(dogToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(dogToPost.name);
          expect(response.body.legs).toEqual(dogToPost.legs);
          
        });
    });
    
    test('POST should respond with 400 status code if there is an error', () => {
      let dog = {legs: '4'};
      
      return superagent.post(`${apiURL}`)
        .send(dog)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });
  });

  // test for failure of data (incomplete)
  // test for GET request prior to POST
  describe('GET /api/dogs', () => {
    test('GET should respond with 200 and data if no error', () => {
      let dogToTest = null;

      dogMockCreate()
        .then(dog => {
          dogToTest = dog;
          return superagent.get(`${apiURL}/${dog._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(dogToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(dogToTest.name);
          expect(response.body.legs).toEqual(dogToTest.legs);
        });
    });

    test('GET should respond with 404 and data if no error', () => {
      return superagent.get(`${apiURL}/1234`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });
});