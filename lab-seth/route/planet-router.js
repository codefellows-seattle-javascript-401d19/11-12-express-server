'use strict';

// vinicio - ES5 version
//const Router = require('express').Router;
const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Planet = require('../model/planet');
const logger = require('../lib/logger');

const planetRouter = module.exports = new Router();

planetRouter.post('/api/planets',jsonParser, (request,response,next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.title || !request.body.content) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }
  
  new Planet(request.body).save()
    .then(planet => response.json(planet))//vinicio-this sends a 200
    .catch(error => {
      logger.log('error','__SERVER_ERROR__');
      logger.log('error',error);

      return response.sendStatus(500);
    });
});

planetRouter.get('/api/planets/:id',(request,response,next) => {
  logger.log('info', 'GET - processing a request');

  Planet.findById(request.params.id)
    .then(planet => {
      if(!planet){
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info',planet);
      return response.json(planet);
    }).catch(error => {
      // vinicio - couldn't parse the id, or other error
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - Returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});