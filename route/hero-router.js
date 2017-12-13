'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Hero = require('../model/hero');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const heroRouter = module.exports = new Router();

// POST METHOD
heroRouter.post('/api/heroes', jsonParser, (request, response, next) => {
  if(!request.body.name || !request.body.description) {
    return next(httpErrors(400, 'body and content are required'));
  }
  return new Hero(request.body).save()
    .then(hero => response.json(hero))
    .catch(next);
});

// GET METHOD
heroRouter.get('/api/heroes/:id', (request,response,next) => {
  return Hero.findById(request.params.id)
    .then(hero => {
      if(!hero){
        throw httpErrors(404, 'hero not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(hero);
    }).catch(next);
});

// DELETE METHOD
heroRouter.delete('/api/heroes/:id', (request,response,next) => {
  return Hero.findByIdAndDelete(request.params.id)
    .then(hero => {
      if(!hero){
        throw httpErrors(404, 'hero not found');
      }
      logger.log('info', 'GET - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

// PUT METHOD
heroRouter.put('/api/heroes/:id',jsonParser, (request,response,next) => {
  let options = {runValidators : true, new : true};

  return Hero.findByIdAndUpdate(request.params.id, request.body, options)
    .then(hero => {
      if(!hero){
        throw httpErrors(404, 'hero not found');
      }
      logger.log('info', 'GET - Returning a 204 status code');
      return response.json(hero);
    }).catch(next);
});
