'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const EpisodesModel = require('../model/star-trek-episodes');
const logger = require('../lib/logger');
const starTrekEpisodesRouter = module.exports = new Router();

starTrekEpisodesRouter.post('/api/star-trek-episodes',jsonParser, (request, response, next)=>{
  logger.log('info', 'POST - processing REQUEST');

  if(!request.body.title || !request.body.content){
    logger.log('info', 'POST - responding with 400 code');
    return response.sendStatus(400);
  }

  return new EpisodesModel(request.body).save()
    .then(episode => response.json(episode))
  
    .catch(error => {logger.log('error', '__SERVER ERROR___');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

starTrekEpisodesRouter.get('/api/star-trek-episodes/:id', (request, response, next) => {
  logger.log('info', 'GET - PROCESSING REQUEST');

  EpisodesModel.findById(request.params.id)
    .then(episode => {
      if(!episode)
        logger.log('info', 'GET - Returning a 404 status');
      return response.json(episode);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET -Return a 404, ID parsing failed');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

//GET BY RESOURCE NAME

//DELETE BY ID
starTrekEpisodesRouter.delete('/api/star-trek-episodes/:id', (request, response, next) => {
  logger.log('info', 'DELETE - PROCESSING REQUEST');

  EpisodesModel.findById(request.params.id)
    .then(episode => {
      if(!episode)
        logger.log('info', 'DELETE - Returning a 404 status');
      return response.remove({
        id : `${request.params.id}`,
      });
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'DELETE - Return a 404, ID parsing failed');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});