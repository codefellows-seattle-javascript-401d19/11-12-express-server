'use strict';

//ES5 version
//const Router = require('express').Router;

const {Router} = require('express');

const jsonParser = require('body-parser').json();

const Bicycle = require('../model/bicycle');

const logger = require('../lib/logger');

const bicycleRouter = module.exports = new Router();


//the next callback does not return a promise; this was introduce prior to that functionality
bicycleRouter.post('/api/bicycles', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request at /api/bicycles');
	
  if(!request.body.Brand || !request.body.Model) {
    logger.log('info', 'POST - responding with a 400 failure code');
    return response.sendStatus(400);
  }
  new Bicycle(request.body).save()  
    .then(bicycle => response.json(bicycle)) //this sends a 200 success code
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

bicycleRouter.get('/api/bicycles', (request, response, next) => {
  logger.log('info', 'GET - processing a request at /api/bicycles');
  Bicycle.find({});
  return response.sendStatus(200)
    .then(bicycles => {
      console.log(bicycles);
      return response.json(bicycles);
    });
});

bicycleRouter.get('/api/bicycles/:id', (request, response, next) => {
  Bicycle.findById(request.params.id)
    .then(bicycle => {
      if(!bicycle) {
        logger.log('info', 'GET - responding with a 404 failure code at /api/bicycles/:id');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - responding with a 200 success code at /api/bicycles/:id');
      logger.log('info', bicycle);
      return response.json(bicycle);
    })
    .catch(error => {
    //couldn't parse the id or other error
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'GET - responding with a 404 failure code at /api/bicycles/:id.  Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - responding with a 500 failure code at /api/bicycles/:id.');
      logger.log('error', error);
      return response.sendStatus(504);
    });
});

bicycleRouter.delete('/api/bicycles/:id', (request, response, next) => {
  logger.log('info', 'DELETE - processing a request at /api/bicycles/:id');

  Bicycle.findByIdAndRemove(request.params.id)
    .then(bicycle => {
      if (!bicycle) {
        logger.log('info', 'DELETE - responding with a 200 failure code at /api/bicycles/:id');
        return response.sendStatus(200);
      }
      logger.log('info', 'DELETE - responding with a 200 success code at /api/bicycles/:id');
      logger.log('info', bicycle);
      return response.json(bicycle);
    })
    .catch(error => {
      //couldn't parse the id or other error
      if (error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'DELETE - responding with a 404 failure code at /api/bicycles/:id.  Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - responding with a 504 failure code at /api/bicycles/:id.');
      logger.log('error', error);
      return response.sendStatus(504);

    });
}); 