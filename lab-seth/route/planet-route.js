'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Planet = require('../model/planet');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const planetRouter = module.exports = new Router();

planetRouter.post('/api/planets', jsonParser, (request,response) => {
  logger.log('info', request);
  

  if(!request.body.name || !request.body.content || !request.body.longitude) {
    return next(httpErrors(400, 'body and content are required'));
  }

  // vinicio - here I added a return
  return new Planet(request.body).save()
    .then(planet => response.json(planet)) //this sends a 200
    .catch(next);
  })
    .catch(error => {
      logger.log('error', '--->SERVER_ERROR<---');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

planetRouter.get('/api/planets/:id', (request,response,next) => {

  return planet.findById(request.params.id)
    .then(planet => {
      if(!planet){
        throw httpErrors(404, 'Planet not found');
      }
      return response.json(planet);
    }).catch(next);
});

planetRouter.get('/api/planets/', (request,response) => {

  planet.find({})
    .then(planet => {
      if(!planet){
        return response.sendStatus(404);
      }
      logger.log('info',planet);
      return response.json(planet);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

planetRouter.delete('api/planets/:id', (request,response) => {

  return planet.findById(request.params.id)
    .then(planet => {
      if(!planet){
        throw httpErrors(404, '')
      }
      logger.log('info',planet);

      response.json(planet).delete();
      return response.json(planet);

    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        return response.sendStatus(404);
      }
      logger.log('error', error);
      return response.sendStatus(500);
    });
});