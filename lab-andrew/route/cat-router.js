'use strict';

const Cat = require('../model/cat');
const {Router} = require('express');
const logger = require('../lib/logger');
const jsonParser = require('body-parser').json();
const catRouter = module.exports = new Router();

catRouter.post('/api/cats', jsonParser, (request, response) => {
  logger.log('info', 'POST - processing new post request');

  if (!request.body.name || !request.body.says) {
    logger.log('info', 'POST - responding with a 400');
    return response.sendStatus(400);
  }

  new Cat(request.body).save()
    .then(cat => response.json(cat))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

catRouter.get('/api/cats/:id',(request, response) => {
  logger.log('info', 'GET - processing a new get request');

  Cat.findById(request.params.id)
    .then(cat => {
      if (!cat){
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', cat);
      return response.json(cat);
    }).catch(error => {
      // if (error.message.indexOf('Cast to ObjectId failed') > -1){
      //   logger.log('info', 'GET - Returning a 404 status code. Could not parse the id');
      //   return response.sendStatus(404);
      // }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

catRouter.get('/api/cats',(request, response) => {
  logger.log('info', 'GET - processing a new get request');

  Cat.findById(request.params.id)
    .then(cat => {
      if (!cat){
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', cat);
      return response.json(cat);
    }).catch(error => {
      if (error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - Returning a 404 status code. Could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

catRouter.delete('/api/cats', (request, response) => {
  logger.log('info', 'You must pass an ID to DELETE');
  return response.sendStatus(400);
});

catRouter.delete('/api/cats/:id', (request, response) => {
  Cat.findByIdAndRemove(request.params.id)
    .then(cat => {
      if (!cat){
        logger.log('info', 'DELETE - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - Returning a 200 status code');
      logger.log('info', cat);
      return response.sendStatus(204);
    }).catch(error => {
      if (error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'DELETE - Returning a 404 status code. Could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});
