'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const EpisodesModel = require('../model/star-trek-episodes');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');
const starTrekEpisodesRouter = module.exports = new Router();

// starTrekEpisodesRouter.get('/api/star-trek-episodes/', (request,response,next) => {
//   const PAGE_SIZE = 10;

//   let {page = '0'} = request.query;
//   page = Number(page);

//   if(isNaN(page))
//     page = 0;
  
//   page = page < 0 ? 0 : page;
//   // TODO : more validation

//   let allNotes = null;

//   return Note.find({})
//     .skip(page * PAGE_SIZE)
//     .limit(PAGE_SIZE)
//     .then(notes => {
//       allNotes = notes;
//       return Note.find({}).count();
//     })
//     .then(noteCount => {
//       // Vinicio - inside this then I have no access to 'notes'
//       let responseData = {
//         count : noteCount,
//         data : allNotes,
//       };
//       // Next Page / Previous Page / Last Page
//       let lastPage = Math.floor(noteCount / PAGE_SIZE);

//       response.links({
//         next : `http://localhost:${process.env.PORT}/api/notes?page=${page === lastPage ? lastPage : page + 1}`,
//         prev : `http://localhost:${process.env.PORT}/api/notes?page=${page < 1 ? 0 : page - 1}`,
//         last : `http://localhost:${process.env.PORT}/api/notes?page=${lastPage}`,
//       });
//       response.json(responseData);
//     });
// });

starTrekEpisodesRouter.post('/api/star-trek-episodes',jsonParser, (request, response, next)=>{
  if(!request.body.title || !request.body.content){
    return next(httpErrors(400, 'body and content are required'));
  }

  return new EpisodesModel(request.body).save()
    .then(episode => response.json(episode))
    .catch(next);
});

starTrekEpisodesRouter.get('/api/star-trek-episodes/:id', (request, response, next) => {
  logger.log('info', 'GET - PROCESSING REQUEST');

  return EpisodesModel.findById(request.params.id)
    .then(episode => {
      if(!episode){
        logger.log('info', 'GET - Returning a 404 status');
        return response.sendStatus(404);
      }
      return response.json(episode);   
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - Return a 404, ID parsing failed');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});


starTrekEpisodesRouter.get('/api/star-trek-episodes/', (request, response, next) => {
  logger.log('info', 'GET - PROCESSING REQUEST');

  return EpisodesModel.find({})
    .then(episodes => {
      if(!episodes){
        logger.log('info', 'GET - Returning a 404 status');
        return response.sendStatus(404);
      }
      return response.json(episodes);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1){
        logger.log('info', 'GET - Return a 404, ID parsing failed');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});


starTrekEpisodesRouter.delete('/api/star-trek-episodes/:id', (request, response, next) => {
  return EpisodesModel.findByIdAndRemove(request.params.id)
    .then(episode => {
      if(!episode){
        throw httpErrors(404, 'episode not found');
      }
      return response.sendStatus(204);
    }).catch(next);
});

//PUT METHOD
starTrekEpisodesRouter.put('/api/star-trek-episodes/:id',jsonParser,(request,response,next) => {
  let options = {runValidators: true, new : true};
  
  return EpisodesModel.findByIdAndUpdate(request.params.id,request.body,options)
    .then(episode => {
      if(!episode){
        throw httpErrors(404,'episode not found');
      }
      return response.json(episode);
    }).catch(next);
});