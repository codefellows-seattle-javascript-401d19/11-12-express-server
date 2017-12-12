'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Hero = require('../model/hero');
const logger = require('../lib/logger');

const heroRouter = module.exports = new Router();

heroRouter.post('/api/heroes', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.name || !request.body.description) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }

  return new Hero(request.body).save()
    .then(hero => response.json(hero))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});


heroRouter.get('/api/heroes/:id', (request,response,next) => {
  logger.log('info', 'GET - processing a request');

  return Hero.findById(request.params.id)
    .then(hero => {
      if(!hero){
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - Returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 status code');
      return response.sendStatus(500);
    });
});

heroRouter.delete('/api/heroes/:id', (request,response,next) => {
  logger.log('info', 'DELETE - processing a request');
  console.log('inside DELETE');

  return Hero.findById(request.params.id)
    .then(hero => {
      if(!hero){
        logger.log('info', 'ERROR__DELETE - Returning a 400 status code');
        return response.sendStatus(400);
      }
      logger.log('info', 'SUCCESSFUL__DELETE - Returning a 204 status code');
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'ERROR__DELETE - Returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('info', 'ERROR__DELETE - Returning a 500 status code');
      return response.sendStatus(500);
    });
});
