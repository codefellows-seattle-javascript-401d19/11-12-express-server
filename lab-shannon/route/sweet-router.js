'use strict';

const logger = require(`../lib/logger`);
const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();
const httpErrors = require(`http-errors`);

const Sweet = require(`../model/sweet`);
const sweetRouter = module.exports = new Router();

sweetRouter.post(`/api/sweets`, jsonParser, (request, response, next) => {
  logger.log(`info`, `Processing a POST request`);
  if(!request.body.name || !request.body.hasChocolate || !request.body.temperature){
    return next(httpErrors(400, `The request body was missing a required property`));
  }

  new Sweet(request.body).save()
    .then(sweet => {
      return response.json(sweet);
    })
    .catch(next);
});

sweetRouter.get(`/api/sweets`, (request, response, next) => {
  logger.log(`info`, `Processing a GET request without an id`);

  return Sweet.find({})
    .then(sweets => {
      if(!sweets){
        throw httpErrors(404, `No Sweets exist yet`);
      }
      logger.log(`info`, `The sweets were successfully retrieved and are being sent as JSON`);
      return response.json(sweets);
    })
    .catch(next);
});

sweetRouter.get(`/api/sweets/:id`, (request, response, next) => {
  logger.log(`info`, `Processing a GET request with an id`);

  return Sweet.findById(request.params.id)
    .then(sweet => {
      if(!sweet){
        throw httpErrors(404, `No sweet found with that id`);
      }
      logger.log(`info`, `Responding with a 200 status to GET request`);
      return response.json(sweet);
    })
    .catch(next);
});

sweetRouter.delete(`/api/sweets/:id`, (request, response, next) => {
  logger.log(`info`, `Processing a DELETE request`);

  if(!request.params.id){
    throw httpErrors(400, `No id provided for deletion`);
  }

  return Sweet.findByIdAndRemove(request.params.id)
    .then(deletedSweet => {
      if(!deletedSweet){
        throw httpErrors(404, `No sweet with that id found; can't delete a non-existent sweet`);
      }
      return response.sendStatus(204);
    })
    .catch(next);
});
