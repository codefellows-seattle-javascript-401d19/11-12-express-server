'use strict';



const {Router} = require('express');
const jsonParser = require('body-parse').json;

const Plant = require('../model/plant');
const logger = require('../lib/logger');

const plantRouter = module.exports = new Router();

plantRouter.post('/api/plants', jsonParser, (request, response, next) => {

  logger.log('info', 'PLANTS : POST | Endpoint triggered');

  if (!request.body.scientificName || !request.body.floraType) {
    logger.log('info', 'PLANTS : POST | Request denied with <400>: Request missing required fields');
    return response.sendStatus(400);
  }

  new Plant(request.body).save()
    .then(logger.log('info', 'PLANTS : POST | Payload succesfully saved to DB'))
    .then(note => response.json(note))
    .catch(error => {
      logger.log('error', `PLANTS : POST | Error attempting to save payload to DB | ${error}`);
      return response.sendStatus(500);
    });

});

plantRouter.get('/api/plant/:id', (request, response, next) => {

  logger.log('info', 'PLANTS : GET | Endpoint triggered');

  Plant.findById(request.params.id)
    .then(result => {
      if(!result) {
        logger.log('info',`PLANTS : GET | Request denied with <400>: <id> not provided`);
        return response.sendStatus(404);
      }
      logger.log('info', 'PLANTS : GET | Item succesfuly retrieved - returning payload to client');
      return response.json(result);
    })
    .catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', `PLANTS : GET | Request denied with <404>: Could not parse <id>: '${request.params.id}'`);
        return response.sentStatus(404);
      }
      logger.log('error', `PLANTS : GET | Error attempting to query item from DB | ${error}`);
      return response.sendStatus(500);
    });

});
