'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();

const User = require('../model/user');
const logger = require('../lib/logger');

const userRouter = module.exports = new Router();

userRouter.post('/api/users', jsonParser, (request, response) => {
  logger.log('info', 'POST - processing a request');

  if (!request.body.name || !request.body.description) {
    logger.log('info', 'POST - responding with a 400 code');
    return response.sendStatus(400);
  }

  new User(request.body).save()
    .then(user => response.json(user))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);

      return response.sendStatus(500);
    });
});

userRouter.get('/api/users/:id', (request, response) => {
  logger.log('info', 'GET - processing a request');

  User.findById(request.params.id)
    .then(user => {
      if (!user) {
        logger.log('info', 'GET - Returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', user);
      return response.json(user);
    })
    .catch(error => {
      if (error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'GET - returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});
