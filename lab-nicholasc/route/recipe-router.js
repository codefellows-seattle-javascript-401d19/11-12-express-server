'use strict';

const {Router} = require('express');

const jsonParser = require('body-parser').json();

const Recipe = require('../model/recipe');
const logger = require('./logger');

const recipeRouter = module.exports = new Router();

recipeRouter.post('/api/recipes', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing request');

  if(!request.body.title || !request.body.content) {
    logger.log('info', 'POST - responding with status 400');
    response.sendStatus(400);
  }
  new Recipe(request.body).save()
    .then(recipe => response.json(recipe))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);

      response.sendStatus(500);
    });
});

recipeRouter.get('/api/recipes/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request');

  Recipe.findById(request.params.id)
    .then(recipe => {
      if(!recipe){
        logger.log('info', 'GET - returning a 404 error');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', recipe);
      response.json(recipe);
    }).catch(error => {
      // error pops if you cant parse id or something else
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - returning a 404 status code, could not parse id');
        return response.sensStatus(404);
      }
      logger.log('error', 'GET - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});
