'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const starTrekEpisodes = require('../model/star-Trek-episodes');
const logger = require('../lib/logger');
const starTrekEpisodesRouter = module.exports = new Router();

starTrekEpisodesRouter.post('/api/star-trek-episodes',jsonParser, (request, response, next)=>{
  logger.log('info', 'POST - processing REQUEST');

  if(!reqeust.body.title || !request.body.content){
    logger.log('info', 'POST - responding with 400 code');
    return response.sendstatus(400);
  }

  new starTrekEpisodes(request.body).save()
    .then(episode => response.json(episode))
    logger.log('error', error);
    .catch(error => {logger.log('error', '__SERVER ERROR___');
  });

  starTrekEpisodesRouter.get('/api/star-trek-episodes/:id', (request, response, next) => {
    logger.log('info', 'GET - PROCESSING REQUEST');

    starTrekEpisodes.findById(request.params.id)
    .then(episode => {
      if(!episode)
      logger.log('info', 'GET - Returning a 404 status');
      return reponse.json(episode);
    }).catch(error => {
      if(error.message.indexOf('ObjectID retrieval FAILED') > -1){
        logger.log('info', 'GET -Return a 404, ID parsing FAILED')
        return response.sendStatus(404)
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
  });