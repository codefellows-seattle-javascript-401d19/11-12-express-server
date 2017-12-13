'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const UserAccount = require('../model/userAccount');
const logger = require('../lib/logger');

const userAccountRouter = module.exports = new Router();

userAccountRouter.post('/api/userAccounts', jsonParser, (request, response, next) => {
  if (!request.body.name || !request.body.description) {
    return next(httpErrors(400, 'name and description are required'));
  }

  return new UserAccount(request.body).save()
    .then(userAccount => response.json(userAccount))
    .catch(next);
});

userAccountRouter.get('/api/userAccounts/:id', (request, response, next) => {
  UserAccount.findById(request.params.id)
    .then(userAccount => {
      if (!userAccount) {
        throw httpErrors(404, 'user not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', userAccount);

      return response.json(userAccount);
    })
    .catch(next);
});

userAccountRouter.get('/api/userAccounts', (request, response, next) => {
  UserAccount.find({})
    .then(userAccounts => {
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', userAccounts);

      return response.json(userAccounts);
    })
    .catch(next);
});

userAccountRouter.delete('/api/userAccounts/:id', (request, response, next) => {
  UserAccount.findOneAndRemove(request.params.id)
    .then(userAccount => {
      if (!userAccount) {
        throw httpErrors(404, 'user id not found');
      }
      logger.log('info', 'DELETE - returning a 204 status code');
      logger.log('info', userAccount);

      return response.sendStatus(204);
    })
    .catch(next);
});

userAccountRouter.delete('/api/userAccounts', (request, response, next) => {
  logger.log('info', 'DELETE - returning a 400 status code. No id provided');
  return next(httpErrors(400, 'id required'));
});
