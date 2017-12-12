'use strict';

process.env.PORT = 3000;

process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Book = require('../model/book');
const server = require('../lib/server');
const logger = require('../lib/logger');

const apiURL = `http://localhost:${process.env.PORT}/api/books`;

const bookMockCreate = () => {
  return new Book({
    title : faker.lorem.words(10),
    author : faker.lorem.words(1),
    content : faker.lorem.words(100),
    genre: 'sci-fi',
  }).save();
};

describe('/api/books', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Book.remove({}));

  describe('POST /api/books', () => {
    test('should respond with a book and 200 status code if there are no errors', () => {
      let bookToPost = {
        title : faker.lorem.words(10),
        author : faker.lorem.words(1),
        content : faker.lorem.words(100),
        genre: 'sci-fi',
      };
      return superagent.post(`${apiURL}`)
        .send(bookToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.title).toEqual(bookToPost.title);
          expect(response.body.author).toEqual(bookToPost.author);
          expect(response.body.content).toEqual(bookToPost.content);          
          expect(response.body.genre).toEqual(bookToPost.genre);
        })
        .catch(error => logger.log('error', error));
    });
    test('should respond with a 400 code if we send an incomplete book', () => {
      let bookToPost = {
        content : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(bookToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/books', () => {
    test('should respond with 200 status code if there is no error', () => {
      let bookToTest = null;

      bookMockCreate()
        .then(book => {
          bookToTest = book;
          return superagent.get(`${apiURL}/${book._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(bookToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.title).toEqual(bookToTest.title);
          expect(response.body.author).toEqual(bookToTest.author);
          expect(response.body.content).toEqual(bookToTest.content);          
          expect(response.body.genre).toEqual(bookToTest.genre);
        })
        .catch(error => logger.log('error', error));        
    });
    test('should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/mooshy`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/books', () => {
    test('DELETE should respond with 204 status code with no content in the body if successfully deleted', () => {
      let bookToDelete = null;

      bookMockCreate()
        .then(book => {
          bookToDelete = book;
          return superagent.del(`${apiURL}/${bookToDelete._id}`)
            .then(response => {
              expect(response.status).toEqual(204);
            })
            .catch(error => logger.log('error', error));
        
        });
    });
  
    test('DELETE should respond with 404 status code if id is not provided', () => {
      return superagent.delete(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});