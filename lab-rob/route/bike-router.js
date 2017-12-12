'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Bike = require('../model/bike');
const logger = require('../lib/logger');
const bikeRouter = module.exports = new Router();

bikeRouter.post('/api/bikes', jsonParser, (request, response) => {
  logger.log('info', 'POST - Processing a request.');
  if (!request.body.make || !request.body.model || !request.body.year || !request.body.displacement) {
    logger.log('info', 'POST - Bad data, responding with a 400 code');
    return response.sendStatus(400);
  }

  new Bike(request.body).save()
    .then(bike => response.json(bike))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bikeRouter.get('/api/bikes/:id', (request, response) => {
  logger.log('info', 'GET - processing a request');
  Bike.findById(request.params.id)
    .then(bike => {
      if(!bike) {
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', bike);
      return response.json(bike);
    })
    .catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'GET - returning a 404 status code. Could not parse id.');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - returning a 500 status code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});