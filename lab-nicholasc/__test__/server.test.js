'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Recipe = require('../model/recipe');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/notes`;

const recipeMockCreate = () => {
  return new Recipe({
    title : faker.lorem.words(10),
    content : faker.lorem.words(100),
  }).save();
};

describe('/api/recipes', () => {
  beforeAll(server.start);
  afterAll(server.start);
  afterEach(() => Recipe.remove({}));

  describe('POST /api/recipes', () => {
    test('should respond with a note and 200 status code if there is no error',
      () =>{
        let recipeToPost = {
          title : faker.lorem.words(10),
          content : faker.lorem.words(100),
        };
        return superagent.post(`${apiURL}`)
          .send(recipeToPost)
          .then(response => {
            expect(response.status).toEqual(200);
          });
      });
  });
});
