'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Wizard = require('../model/wizard');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const wizardRouter = module.exports = new Router();

wizardRouter.post('/api/wizards', jsonParser, (request, response, next) => {

  if(!request.body.title || !request.body.content || !request.body.author || !request.body.genre) {
    return next(httpErrors(400, 'body and content are required'));
  }
  
  return new Wizard(request.body).save()
    .then(wizard => response.json(wizard))
    .catch(next);
});

wizardRouter.get('/api/wizards', (request, response) => {

  return Wizard.find({}, (error, wizards) => {
    let wizardMap = [];

    wizards.forEach(wizard => {
      wizardMap.push(wizard);
    });

    return response.json(wizardMap);
  });
});

wizardRouter.get('/api/wizards/:id', (request, response, next) => {

  return Wizard.findById(request.params.id)
    .then(wizard => {
      if(!wizard){
        throw httpErrors(404, 'wizard not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(wizard);
    }).catch(next);
});

wizardRouter.delete('/api/wizards/:id', (request, response, next) => {
  return Wizard.findByIdAndRemove(request.params.id)
    .then(wizard => {
      if(!wizard) {
        throw httpErrors(404, 'wizard not found');
      } 
      logger.log('info', 'DELETE - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

wizardRouter.delete('/api/wizards', (request, response) => {
  return response.sendStatus(400);
});

wizardRouter.put('/api/wizards/:id', jsonParser, (request, response, next) => {
  let options = {runValidators: true, new: true};
  return Wizard.findByIdAndUpdate(request.params.id, request.body, options)
    .then(wizard => {
      if(!wizard) {
        throw httpErrors(404, 'wizard not found');
      }
      logger.log('info', 'PUT - Returning a 200 status code');
      return response.json(wizard);
    }).catch(next);
});