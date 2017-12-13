'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Book = require('../model/book');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const bookRouter = module.exports = new Router();

bookRouter.post('/api/books', jsonParser, (request, response, next) => {

  if(!request.body.title || !request.body.content || !request.body.author || !request.body.genre) {
    return next(httpErrors(400, 'body and content are required'));
  }
  
  return new Book(request.body).save()
    .then(book => response.json(book))
    .catch(next);
});

bookRouter.get('/api/books', (request, response) => {

  return Book.find({}, (error, books) => {
    let bookMap = [];

    books.forEach(book => {
      bookMap.push(book);
    });

    return response.json(bookMap);
  });
});

bookRouter.get('/api/books/:id', (request, response, next) => {

  return Book.findById(request.params.id)
    .then(book => {
      if(!book){
        throw httpErrors(404, 'book not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(book);
    }).catch(next);
});

bookRouter.delete('/api/books/:id', (request, response, next) => {
  return Book.findByIdAndRemove(request.params.id)
    .then(book => {
      if(!book) {
        throw httpErrors(404, 'book not found');
      } 
      logger.log('info', 'DELETE - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

bookRouter.delete('/api/books', (request, response) => {
  return response.sendStatus(400);
});

bookRouter.put('/api/books/:id', jsonParser, (request, response, next) => {
  let options = {runValidators: true, new: true};
  return Book.findByIdAndUpdate(request.params.id, request.body, options)
    .then(book => {
      if(!book) {
        throw httpErrors(404, 'book not found');
      }
      logger.log('info', 'PUT - Returning a 200 status code');
      return response.json(book);
    }).catch(next);
});