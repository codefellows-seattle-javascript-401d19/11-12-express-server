'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Bike = require('../model/bike');
const logger = require('../lib/logger');
const bikeRouter = module.exports = new Router();

bikeRouter.post('/api/bikes', jsonParser, (request, response) => {
  logger.log('info', 'POST - Processing a request.');
  if (!request.body.make || !request.body.model || !request.body.year || !request.body.displacement) {
    logger.log('info', 'POST - Bad data, responding with a 400 code');
    return response.sendStatus(400);
  }

  new Bike(request.body).save()
    .then(bike => response.json(bike))
    .catch(error => {
      logger.log('error', '__SERVER_ERROR__');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bikeRouter.get('/api/bikes', (request, response) => {
  logger.log('info', 'GET - Processing a request for all bikes');

  Bike.find({})
    .then(bikes => {
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', bikes);
      return response.json(bikes);
    })
    .catch(error => {
      logger.log('error', 'GET - returning a 500 status code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bikeRouter.get('/api/bikes/:id', (request, response) => {
  logger.log('info', `GET - processing a request for a single bike`);

  Bike.findById(request.params.id)
    .then(bike => {
      if(!bike) {
        logger.log('info', 'GET - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', bike);
      return response.json(bike);
    })
    .catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'GET - returning a 404 status code. Could not parse id.');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - returning a 500 status code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bikeRouter.delete('/api/bikes', (request, response) => {
  logger.log('info', 'DELETE - request without id, sending 400 status code.');
  response.sendStatus(400);
});

bikeRouter.delete('/api/bikes/:id', (request, response) => {
  logger.log('info', `DELETE - processing a request for a single bike.`);

  Bike.findByIdAndRemove(request.params.id)
    .then(bike => {
      if(!bike) {
        logger.log('info', 'DELETE - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - returning a 204 status code');
      logger.log('info', bike);
      return response.sendStatus(204);
    })
    .catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'DELETE - returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - returning a 500 status code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bikeRouter.put('/api/bikes/:id', jsonParser, (request, response) => {
  logger.log('info', 'PUT - processing a request.');
  let updateData = {};
  if(request.body.make)
    updateData.make = request.body.make;
  if(request.body.model)
    updateData.model = request.body.model;
  if(request.body.year)
    updateData.year = parseInt(request.body.year);
  if(request.body.displacement)
    updateData.displacement = parseInt(request.body.displacement);
  if(Object.keys(updateData).length === 0) {
    logger.log('info', 'PUT - No valid data to update with. Sending 400 status code.');
    return response.sendStatus(400);
  }

  Bike.findByIdAndUpdate(request.params.id, {$set: updateData}, {new: true})
    .then(bike => {
      if(!bike) {
        logger.log('info', 'PUT - Bike with given id not found. Sending 404 status code.');
        return response.sendStatus(404);
      }
      logger.log('info', 'PUT - returning a 200 status code');
      logger.log('info', bike);
      return response.json(bike);
    })
    .catch(error => {
      if (error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'PUT - returning a 404 status code. Could not parse id.');
        return response.sendStatus(404);
      }
      logger.log('error', 'PUT - returning a 500 status code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});