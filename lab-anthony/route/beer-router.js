'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Beer = require('../model/beer');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const beerRouter = module.exports = new Router();

beerRouter.post('/api/beers', jsonParser, (request, response, next) => {

  if(!request.body.brewery || !request.body.beer) {
    return next(httpErrors(400,'brewery and beer are required'));
  }

  return new Beer(request.body).save()
    .then(beer => {
      return response.json(beer);
    })
    .catch(next);
});

beerRouter.get('/api/beers/:id', (request, response, next) => {
  return Beer.findById(request.params.id)
    .then(beer => {
      if(!beer) {
        throw httpErrors(404,'beer not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(beer);
    }).catch(next);
});

beerRouter.delete('/api/beers/:id', (request, response, next) => {
  logger.log('info', 'DELETE - processing a request');

  return Beer.findById(request.params.id)
    .then(beer => {
      if(!beer) {
        throw httpErrors(404,'beer not found');
      } else {
        return Beer.deleteOne({_id : beer._id})
          .then((results) => {
            if(results.deletedCount === 1)
              return response.sendStatus(204);  
          });
      }
    }).catch(next);
});
