'use strict';

const logger = require(`../lib/logger`);
const {Router} = require(`express`);  //only taking the Router property/function from express because that's all we're using
const jsonParser = require(`body-parser`).json(); //because we are only using the .json property of body-parser

const Sweet = require(`../model/sweet`);
const sweetRouter = module.exports = new Router();

sweetRouter.post(`/api/sweets`, jsonParser, (request, response, next) => {
  // why do we need next? It doesn't seem to be used anywhere?
  logger.log(`info`, `Processing a POST request`);
  if(!request.body.name || !request.body.hasChocolate || !request.body.temperature){
    logger.log(`info`, `Sending a 400 request because information was missing from the body`);
    return response.sendStatus(400);
  }

  new Sweet(request.body).save()
    .then(sweet => {
      return response.json(sweet);
      // why don't we need to explicitly return a 200 status?
    })
    .catch(error => {
      logger.log(`info`, `Responding with a 500 status for POST request. Nothing appears wrong with the request`);
      logger.log(`error`, error);
      return response.sendStatus(500);
    });
});

sweetRouter.get(`/api/sweets`, (request, response, next) => {
  logger.log(`info`, `Processing a GET request without an id`);
  console.log(`The GET request ran without an id`);

  return Sweet.find({})
    .then(sweets => {
      if(!sweets){
        logger.log(`info`, `Sending a 404 status; no Sweets exist`);
        return response.sendStatus(404);
      }
      logger.log(`info`, `The sweets were successfully retrieved and are being sent as JSON`);
      return response.json(sweets);
    })
    .catch(error => {
      logger.log(`info`, error);
      return response.sendStatus(500);
    })
})

sweetRouter.get(`/api/sweets/:id`, (request, response, next) => {
  logger.log(`info`, `Processing a GET request with an id`);

  return Sweet.findById(request.params.id)
    .then(sweet => {
      if(!sweet){
        logger.log(`info`, `Sending a 404 status. No sweet found with that id`);
        return response.sendStatus(404);
      }
      logger.log(`info`, `Responding with a 200 status to GET request`);
      return response.json(sweet);
    })
    .catch(error => {
      if(error.message.indexOf(`Cast to ObjectId failed`) > -1){
        logger.log(`info`, `Returning 404 status to GET request. Could not parse id provided`);
        return response.sendStatus(404);
      }
      logger.log(`info`, `Sending a 500 status. An error occurred while getting the Sweet.`);
      return response.sendStatus(500);
    });
});

sweetRouter.delete(`/api/sweets/:id`, (request, response, next) => {
  logger.log(`info`, `Processing a DELETE request`);

  if(!request.params.id){
    logger.log(`info`, `Sending a 400 status; no id provided for deletion`);
    return response.sendStatus(400);
  }

  return Sweet.findByIdAndRemove(request.params.id)
    .then(deletedSweet => {
      if(!deletedSweet){
        logger.log(`info`, `Sending a 404 status; no sweet with id found for deletion`);
        return response.sendStatus(404);
      }
      return response.sendStatus(204);
    })
    .catch(error => {
      logger.log(`info`, `An error occurred while trying to delete a document`);
      logger.log(`info`, error);
    });
});
