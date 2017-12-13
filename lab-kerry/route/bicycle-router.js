'use strict';

//ES5 version
//const Router = require('express').Router;

const {Router} = require('express');

const jsonParser = require('body-parser').json();

const Bicycle = require('../model/bicycle');

const logger = require('../lib/logger');

const httpErrors = require('http-errors');

const bicycleRouter = module.exports = new Router();



//the next callback does not return a promise; this was introduce prior to that functionality
bicycleRouter.post('/api/bicycles', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request at /api/bicycles');
	
  if(!request.body.Brand || !request.body.Model) {
    return next(httpErrors(400, 'Body and content are required'));
  }
  return new Bicycle(request.body).save()  
    .then(bicycle => response.json(bicycle)) //this sends a 200 success code
    .catch(next);
});

//TODO fix this to reflect "next" syntax
bicycleRouter.get('/api/bicycles', (request, response, next) => {
  logger.log('info', 'GET - processing a request at /api/bicycles');
  return Bicycle.find({})
    .then(bicycles => {
      return response.json(bicycles);
    })
    .catch(next);
});

bicycleRouter.get('/api/bicycles/:id', (request, response, next) => {
  return Bicycle.findById(request.params.id)
    .then(bicycle => {
      if(!bicycle) {
        throw httpErrors(404, 'note not found');
      }
      logger.log('info', 'GET - responding with a 200 success code at /api/bicycles/:id');
      return response.json(bicycle);
    })
    .catch(next);
});

bicycleRouter.delete('/api/bicycles/:id', (request, response, next) => {
  return Bicycle.findByIdAndRemove(request.params.id)
    .then(bicycle => {
      if (!bicycle) {
        throw httpErrors(404, 'note not found');
      }
      logger.log('info', 'DELETE - responding with a 204 success code at /api/bicycles/:id');
      return response.sendStatus(204);
    })
    .catch(next);
}); 