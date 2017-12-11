import { LOADIPHLPAPI } from 'dns';

'use strict';

const {Router} = require('express');
const JSONPARSER = require('body-parser').json();

const MOUNTAIN = require('../model/mountain');
const LOGGER = require('../lib/logger');

const MOUNTAINROUTER = module.exports = new Router();

MOUNTAINROUTER.post('/api/mountains', JSONPARSER, (request,response,next) => {
  LOGGER.log('info', 'POST - processing that request');

  if(!request.body.title || !request.body.content) {
    LOGGER.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }

  new Mountain(request.body).save()
    .then(mountain => response.json(mountain))
    .catch(error => {
      LOGGER.log('error', '--->SERVER_ERROR<---');
      LOGGER.log('error', error);

      return response.sendStatus(500);
    });
});

MOUNTAINROUTER.get('api/notes/:id', (request,response,next) => {
  LOGGER.log('info', 'GET - processing a request');

  Mountain.findById(request.params.id)
    .then(mountain => {
      if(!mountain){
        LOGGER.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      LOGGER.log('info', 'GET - returning a 200 status code');
      LOGGER.log('info',mountain);
      return response.json(mountain);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        LOGGER.log('info', 'GET - returning a 404 status code. could not parse the id');
        return response.sendStatus(404);
      }
      LOGGER.log('error', 'GET - returning a 500 code');
      LOGGER.log('error', error);
      return response.sendStatus(500);
    });
});