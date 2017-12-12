'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Planet = require('../model/planet');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const planetRouter = module.exports = new Router();

planetRouter.post('/api/planets', jsonParser, (request,response) => {  
  if(!request.body.name || !request.body.content || !request.body.longitude) {
    return next(httpErrors(400, 'body and content are required'));
  }

  return new Planet(request.body).save()
    .then(planet => response.json(planet)) //this sends a 200
    .catch(next);
});

planetRouter.get('/api/planets/:id', (request,response,next) => {
  return Planet.findById(request.params.id)
    .then(planet => {
      if(!planet){
        throw httpErrors(404, 'Planet not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(planet);
    }).catch(next);
});

planetRouter.delete('/api/planets/:id', (request, response, next) => {
  return Planet.findByIdAndRemove(request.params.id)
    .then(planet => {
      if (!planet) {
        throw httpErrors(404, 'planet not found');
      }
      logger.log('info', 'GET - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

planetRouter.put('/api/planets/:id', jsonParser, (request, response, next) => {
  let options = { runValidators: true, new: true };

  return Planet.findByIdAndUpdate(request.params.id, request.body, options)
    .then(planet => {
      if (!planet) {
        throw httpErrors(404, 'planet not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(planet);
    }).catch(next);
});