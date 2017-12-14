'use strict';

// const Router = require('express').Router;
const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Dog = require('../model/dogs');
const log = require('../lib/logger');

const dogRouter = module.exports = new Router();

// ===================== POST ROUTES =====================
dogRouter.post('/api/dogs', jsonParser, (request, response, next) => {
  log('info', `==NAME==: ${request.body.name}`);
  log('info', `==LEGS==: ${request.body.legs}`);

  if (!request.body.name || !request.body.legs) {
    return next(httpErrors(400), 'body and content are require');
  }

  new Dog(request.body).save()
    .then(dog => {
      log('info', `==_ID==: ${dog._id}`);
      log('info', `==TIMESTAMP==: ${dog.timestamp}`);
      log('info', 'POST - responding with a 200 status');
      response.json(dog);
      return;
    })
    .catch(next);
});

// ===================== GET ROUTES =====================
dogRouter.get('/api/dogs', (request, response, next) => {
  return Dog.find({})
    .limit(10)
    .then(allDogs => {
      log('info', `==DOG ARRAY==: ${allDogs}`);
      if (allDogs.length === 0) {
        throw httpErrors(404, 'no dogs listed not found');
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(allDogs);
    })
    .catch(next);
});

dogRouter.get('/api/dogs/:id', (request, response, next) => {
  return Dog.findById(request.params.id)
    .then(dog => {
      log('info', `==DOG==: ${dog}`);
      if (!dog) {
        throw httpErrors(404, 'dog not found');
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(dog);
    })
    .catch(next);
});

// ===================== PUT ROUTES =====================
dogRouter.put('/api/dogs/:id', jsonParser, (request, response, next) => {
  if (!request.params.id) {
    throw httpErrors(400, 'no ID given');
  }
  let updateOptions = {runValidators: true, new: true};

  return Dog.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then(dog => {
      if (!dog) {
        throw httpErrors(404, 'dog not found');
      } else {
        log('info', 'PUT - responding with a 200 status');
        return response.json(dog);
      }
    })
    .catch(next);
});

// ===================== DELETE ROUTES =====================
dogRouter.delete('/api/dogs/:id', (request, response, next) => {
  if (!request.params.id) {
    throw httpErrors(400, 'no ID given');
  }

  return Dog.findByIdAndRemove(request.params.id)
    .then(dog => {
      if (!dog) {
        throw httpErrors(404, 'dog not found');
      } else {
        log('info', 'DELETE - responding with a 204 status');
        return response.sendStatus(204);
      }
    })
    .catch(next);
});