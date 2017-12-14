'use strict';

const Cat = require('../model/cat');
const {Router} = require('express');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const catRouter = module.exports = new Router();

catRouter.post('/api/cats', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing new post request');

  if (!request.body.name || !request.body.says) {
    logger.log('info', 'POST - responding with a 400');
    return next(httpErrors(400, 'body and content are required'));
  }

  return new Cat(request.body).save()
    .then(cat => response.json(cat))
    .catch(next);
});

catRouter.get('/api/cats', (request, response, next) => {
  logger.log('info', 'GET - processing a new get request');

  return Cat.find({})
    .then(cats => {
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(cats);
    })
    .catch(error => {
      return next(httpErrors(500, `error with retrieving from db: ${error}`));
    });
});

catRouter.get('/api/cats/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a new get request');

  return Cat.findById(request.params.id)
    .then(cat => {
      if (!cat){
        throw httpErrors(404, 'cat not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', cat);
      return response.json(cat);
    })
    .catch(next);
});

catRouter.put('/api/cats/:id', jsonParser, (request, response, next) => {
  logger.log('info', 'PUT - processing a new put request');

  return Cat.findById(request.params.id)
    .then(cat => {
      if (!request.body.name || !request.body.says) {
        throw httpErrors(400, 'body and content are required');
      }
      if (!cat){
        throw httpErrors(404, 'cat not found');
      }
      cat.set({
        name: `${request.body.name}`,
        says: `${request.body.says}`,
      });
      logger.log('info', 'PUT - Returning a 200 status code');
      logger.log('info', cat);
      return cat.save()
        .then(updatedCat => response.json(updatedCat))
        .catch(error => {
          return next(httpErrors(500, `error with saving to db: ${error}`));
        });
    })
    .catch(next);
});

catRouter.delete('/api/cats', (request, response, next) => {
  return next(httpErrors(400, 'You must pass an ID to DELETE'));
});

catRouter.delete('/api/cats/:id', (request, response, next) => {
  return Cat.findByIdAndRemove(request.params.id)
    .then(cat => {
      if (!cat){
        throw httpErrors(404, 'cat not found');
      }
      logger.log('info', 'DELETE - Returning a 200 status code');
      logger.log('info', cat);
      return response.sendStatus(204);
    })
    .catch(next);
});
