'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const mountain = require('../model/mountain');
const logger = require('../lib/logger');

const mountainRoute = module.exports = new Router();

mountainRoute.post('/api/mountains', jsonParser, (request,response) => {
  logger.log('info', 'POST - processing that request');  

  if(!request.body.name || !request.body.state || !request.body.range) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }

  return new mountain(request.body).save()
    .then(mountain => {
      logger.log('info', 'returning with a 200 status and a mountain');
      return response.json(mountain);
    })
    .catch(error => {
      logger.log('error', '--->SERVER_ERROR<---');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

mountainRoute.get('/api/mountains/:id', (request,response) => {
  logger.log('info', 'GET - processing a request for a specific id');

  mountain.findById(request.params.id)
    .then(mountain => {
      if(!mountain){
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info',mountain);
      return response.json(mountain);
    }).catch(error => {
      if(error.message.toLowerCase().includes('cast to objectid failed')){
        logger.log('info', 'GET - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

mountainRoute.get('/api/mountains/', (request,response) => {
  logger.log('info', 'GET - processing for a non-ID specific request');

  mountain.find({})
    .then(mountain => {
      if(!mountain){
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info',mountain);
      return response.json(mountain);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

mountainRoute.delete('/api/mountains/:id', (request,response) => {
  logger.log('info', 'DELETE - processing a delete request for a specific id');

  mountain.findById(request.params.id)
    .then(mountain => {
      if(!mountain){
        logger.log('info', 'DELETE - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - returning a 200 status code');
      logger.log('info',mountain);

      response.json(mountain).delete();
      return response.json(mountain);

    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'DELETE - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});