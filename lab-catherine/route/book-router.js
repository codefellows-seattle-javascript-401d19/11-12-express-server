'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Book = require('../model/book');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const bookRouter = module.exports = new Router();

bookRouter.post('/api/books', jsonParser, (request, response, next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.title || !request.body.content || !request.body.author || !request.body.genre) {
    return next(httpErrors(400, 'body and content are required'));
  }
  
  return new Book(request.body).save()
    .then(note => response.json(note))
    .catch(next);
});

bookRouter.get('/api/books', (request, response) => {
  logger.log('info', 'GET - processing a request for all books');

  return Book.find({}, (error, books) => {
    let bookMap = [];

    books.forEach(book => {
      bookMap.push(book);
    });

    return response.json(bookMap);
  });
});

bookRouter.get('/api/books/:id', (request, response, next) => {
  logger.log('info', 'GET - processing a request for a specific book');

  return Book.findById(request.params.id)
    .then(book => {
      if(!book){
        throw httpErrors(404, 'book not found'); // is actually going to go to the catch 
        // logger.log('info', 'GET - Returning a 404 status code');
        // return response.sendStatus(404);
      }
      logger.log('info', 'GET - Returning a 200 status code');
      // logger.log('info', book);
      return response.json(book);
    }).catch(next);
  // catch(error => {
  //   if(error.message.indexOf('Cast to ObjectId failed') > -1) {
  //     logger.log('info', 'GET - Returning a 404 status code. Unable to parse id');
  //     return response.sendStatus(404);
  //   }
  //   logger.log('error', 'GET - Returning a 500 code');
  //   logger.log('error', error);
  //   return response.sendStatus(500);
  // });

});

bookRouter.delete('/api/books/:id', (request, response, next) => {
  return Book.findByIdAndRemove(request.params.id)
    .then(book => {
      if(!book) {
        // logger.log('info', 'DELETE - Returning a 404 status code');
        // return response.sendStatus(404);
        throw httpErrors(404, 'book not found');
      } 
      logger.log('info', 'DELETE - Returning a 204 status code');
      logger.log('info', book);
      return response.sendStatus(204);
    }).catch(error => {
      if(error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'DELETE - Returning a 404 status code. Unable to parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - Returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

bookRouter.delete('/api/books', (request, response) => {
  logger.log('info', 'DELETE - You must designate an id to delete');
  return response.sendStatus(400);
});

bookRouter.put('/api/books/:id', jsonParser, (request, response, next) => {
  // this configures mongo update behavior
  let options = {runValidators: true, new: true};
  // additional validation before updating?
  return Book.findByIdAndUpdate(request.params.id, request.body, options)
    .then(book => {
      if(!book) {
        throw httpErrors(404, 'book not found');
      }
      logger.log('info', 'PUT - Returning a 200 status code');
      return response.json(book);
    }).catch(next);
});


// bookRouter.get('/api/books', (request, response, next) => {
//   const PAGE_SIZE = 10;
//   let {page = '0'} = request.query;  // from the large request.query object - just extract the page
//   page = Number(page);

//   if(isNaN(page)) 
//     page = 0;

//   page = page < 0 ? 0 : page;
//   // TODO: more validation

//   let allBooks = null;

//   return Book.find({})
//     .skip(page * PAGE_SIZE)
//     .limit(PAGE_SIZE)
//     .then(books => {
//       allBooks = books;
//       return Book.find({}).count();
//     })
//     .then(bookCount => {
//       // inside this then I have no access to 'books'
//       let responseData = {
//         count : bookCount,
//         data: allBooks,
//       };
//       // Next Page / Previous Page / Last Page
//       let lastPage = Math.floor(bookCount / PAGE_SIZE);
//       response.links({
//         next: `http://localhost:${process.env.PORT}/api/books?page=${page === lastPage ? lastPage : page + 1}`,
//         prev: `http://localhost:${process.env.PORT}/api/books?page=${page < 1 ? 0 : page - 1}`,
//         last: `http://localhost:${process.env.PORT}/api/books?page=${lastPage}`,
//       });

//       response.json(responseData);
//     });
// });