'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Team = require('../model/team');
const logger = require('../lib/logger');

const teamRouter = module.exports = new Router();

teamRouter.post('/api/teams',jsonParser, (request,response) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.sport || !request.body.city) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }

  new Team(request.body).save()
    .then(team => response.json(team))
    .catch(error => {
      logger.log('error','__SERVER_ERROR__');
      logger.log('error',error);

      return response.sendStatus(500);
    });
});

teamRouter.get('/api/teams/:id',(request,response) => {
  logger.log('info', 'GET - processing a request');

  Team.findById(request.params.id)
    .then(team => {
      if(!team){
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info',team);
      return response.json(team);
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

teamRouter.delete('/api/teams:id', (request, response) => {
  logger.log('info', 'DELETE - processing a request');

  Team.findByIdAndRemove(request.params.id)
    .then(team => {
      if(!team){
        logger.log('info', 'DELETE - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - Returning a 204 status code');
      logger.log('info', team);
      return response.sendStatus(204);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'DELETE - Returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

teamRouter.delete('/api/teams', (request, response) => {
  logger.log('info', 'DELETE - request without an id.  Returning 400');
  return response.sendStatus(400);
});
