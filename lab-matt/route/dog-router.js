'use strict';

// const Router = require('express').Router;
const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Dog = require('../model/dogs');
const log = require('../lib/logger');

const dogRouter = module.exports = new Router();

dogRouter.post('/api/dogs', jsonParser, (request, response, next) => {
  log('info', 'POST - processing a request');
  log('info', `==NAME==: ${request.body.name}`);
  log('info', `==LEGS==: ${request.body.legs}`);

  if (!request.body.name || !request.body.legs) {
    log('info', 'POST - responding with a 400 status');
    response.sendStatus(400);
    return;
  }

  new Dog(request.body).save()
    .then(dog => {
      log('info', `==_ID==: ${dog._id}`);
      log('info', `==TIMESTAMP==: ${dog.timestamp}`);
      response.json(dog);
      return;
    })
    .catch(error => {
      log('error', '__SERVER_ERROR__');
      log('error', error);
      response.sendStatus(500);
      return;
    });
});

dogRouter.get('/api/dogs/:id', (request, response, next) => {
  log('info', 'GET - processing a request');

  Dog.findById(request.params.id)
    .then(dog => {
      log('info', `==DOG==: ${dog}`);
      if (!dog) {
        return response.sendStatus(404);
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(dog);
    })
    .catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        log('info', 'GET - Returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      log('error', 'GET - Returning a 500 code');
      log('error', error);
      return response.sendStatus(500);
    });
});


// dogRouter.delete('/api/dogs:id', (request, response, next) => {

//   if (dogId) {
//     storage.deleteItem(dogId)
//       .then(dogFound => {
//         if (dogFound.deleted.id === dogId) {
//           log('info', `DOG DELETED: ${JSON.stringify(dogFound.deleted)}`);
//           response.writeHead(204);
//           response.write(dogFound.deleted.id);
//           response.end();    
//         } else {
//           sendStatus(response, 404, dogFound);
//         }
//       }) // mattL - here, if there is no dogfound.deleted === new Error (storage.js: line68)
//       .catch(error => {
//         sendStatus(response, 404, error);        
//       }); 
//     return;
//   } else {
//     sendStatus(response, 400, `no id given`);
//   }
// });