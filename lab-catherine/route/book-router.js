'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Book = require('../model/book');
const logger = require('../lib/logger');

const bookRouter = module.exports = new Router();

bookRouter.post('/api/books', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.title || !request.body.content || !request.body.author || !request.body.genre) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }
  
  return new Book(request.body).save() // added a return
    .then(note => response.json(note))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

bookRouter.get('/api/books', (request, response) => {
  logger.log('info', 'GET - processing a request for all books');

  Book.find({}, (error, books) => {
    let bookMap = [];

    books.forEach(book => {
      bookMap.push(book);
    });

    console.log('book map:', bookMap);
    return response.json(bookMap);
  });
});

bookRouter.get('/api/books/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request for a specific book');

  Book.findById(request.params.id)
    .then(book => {
      if(!book){
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', book);
      return response.json(book);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'GET - Returning a 404 status code. Unable to parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });

});

bookRouter.delete('/api/books/:id', (request, response) => {
  logger.log('info', 'DELETE - processing a request');
  Book.findByIdAndRemove(request.params.id)
    .then(book => {
      if(!book) {
        logger.log('info', 'DELETE - Returning a 404 status code');
        return response.sendStatus(404);
      } 
      logger.log('info', 'DELETE - Returning a 204 status code');
      logger.log('info', book);
      return response.sendStatus(204);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'DELETE - Returning a 404 status code. Unable to parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bookRouter.delete('/api/books', (request, response) => {
  logger.log('info', 'DELETE - You must designate an id to delete');
  return response.sendStatus(400);
});
