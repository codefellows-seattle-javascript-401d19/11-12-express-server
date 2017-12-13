'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Team = require('../model/team');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const teamRouter = module.exports = new Router();

teamRouter.post('/api/teams',jsonParser, (request,response, next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.sport || !request.body.city) {
    return next(httpErrors(400, 'sport and city are required'));
  }

  return new Team(request.body).save()
    .then(team => response.json(team))
    .catch(next);
});

teamRouter.get('/api/teams/:id',(request,response, next) => {
  logger.log('info', 'GET by id- processing a request');

  return Team.findById(request.params.id)
    .then(team => {
      if(!team){
        throw httpErrors(404, 'team not found');
      }
      logger.log('info', 'GET by id- Returning a 200 status code');
      return response.json(team);
    }).catch(next);
});
teamRouter.get('/api/teams', (request, response, next) => {
  logger.log('info', 'GET - processing a request');
  return Team.find({})
    .then(teams =>{
      return response.json(teams);
    });
});
teamRouter.delete('/api/teams/:id', (request, response, next) => {
  logger.log('info', 'DELETE - processing a request');

  return Team.findByIdAndRemove(request.params.id)
    .then(team => {
      if(!team){
        throw httpErrors(404, 'team not found');
      }
      logger.log('info', 'DELETE - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

teamRouter.delete('/api/teams', (request, response, next) => {
  logger.log('info', 'DELETE - request without an id.  Returning 400');
  return response.sendStatus(400);
});
