'use strict';

console.log('!!! Plant-router hit.');

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Plant = require('../model/plant');
//const logger = require('../lib/logger');

const plantRouter = module.exports = new Router();

plantRouter.post('/api/plants', jsonParser, (request, response/*, next*/) => {

  console.log('info', 'PLANTS : POST | Endpoint triggered');

  console.log('Request Body: ' + JSON.stringify(request.body));

  if (!request.body.scientificName || !request.body.floraType) {
    console.log('info', 'PLANTS : POST | Request denied with <400>: Request missing required fields');
    return response.sendStatus(400);
  }

  new Plant(request.body).save()
    .then(console.log('info', 'PLANTS : POST | Payload succesfully saved to DB'))
    .then(() => response.sendStatus(200))
    .catch(error => {
      console.log('error', `PLANTS : POST | Error attempting to save payload to DB | ${error}`);
      return response.sendStatus(500);
    });

});

plantRouter.get('/api/plants/:id', (request, response/*, next*/) => {

  console.log('info', 'PLANTS : GET | Endpoint triggered');

  Plant.findById(request.params.id)
    .then(result => {
      if(!result) {
        console.log('info',`PLANTS : GET | Request denied with <404>: <id> not provided`);
        return response.sendStatus(404);
      }
      console.log('info', 'PLANTS : GET | Item succesfuly retrieved - returning payload to client');
      return response.json(result);
    })
    .catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        console.log('info', `PLANTS : GET | Request denied with <404>: Could not parse <id>: '${request.params.id}'`);
        return response.sendStatus(404);
      }
      console.log('error', `PLANTS : GET | Error attempting to query item from DB | ${error}`);
      return response.sendStatus(500);
    });

});
