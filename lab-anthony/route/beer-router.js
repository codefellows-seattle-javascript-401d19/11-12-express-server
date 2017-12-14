'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Beer = require('../model/beer');
const logger = require('../lib/logger');

const beerRouter = module.exports = new Router();

beerRouter.post('/api/beers', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.brewery || !request.body.beer) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }

  return new Beer(request.body).save()
    .then(beer => {
      logger.log('info','Returning with a 200 status and a mountain');
      return response.json(beer);
    })
    .catch(error => {
      logger.log('error', '--->SERVER_ERROR<---');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

beerRouter.get('/api/beers/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request');

  return Beer.findById(request.params.id)
    .then(beer => {
      if(!beer) {
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', beer);
      return response.json(beer);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - Returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

beerRouter.delete('/api/beers/:id', (request, response, next) => {
  logger.log('info', 'DELETE - processing a request');

  return Beer.findById(request.params.id)
    .then(beer => {
      if(!beer) {
        logger.log('info', 'Delete returning a 404 status code');
        return response.sendStatus(404);
      } else {
        return Beer.deleteOne({_id : beer._id})
          .then((results) => {
            if(results.deletedCount === 1) {
              return response.sendStatus(204);
            } else {
              return response.sendStatus(500);
            }
          });
      }
    }).catch(error => {
      logger.log('error', error);
      return response.sendStatus(400);
    });
});
