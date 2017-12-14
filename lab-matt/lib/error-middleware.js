'use strict';

const log = require('../lib/logger');

module.exports = (error, request, response, next) => {
  // ================ HTTP ERRORS ================
  log('info', `__ERROR_MIDDLEWARE__ `);
  log('error', error);

  if (error.status) {
    log('info', `Responding with a ${error.status} status`);
    return response.sendStatus(error.status);
  }
  
  // ================ MONGO ERRORS ================
  let message = error.message.toLowerCase();  

  if (message.includes('validation failed')) {
    log('info', 'Responding with a 400 status code');
    return response.sendStatus(400);
  }
  
  if (message.includes('duplicate key')) {
    log('info', 'Responding with a 409 status code');
    return response.sendStatus(409);
  }

  if (message.includes('objectid failed')) {
    log('info', 'Responding with a 404 status code');
    return response.sendStatus(404);
  }

  if (message.includes('unauthorized')) {
    log('info', 'Responding with a 401 status code');
    return response.sendStatus(401);
  }

  // ================ ELSE ================
  log('info', 'Responding with a 500 status code');
  log('error', error);
  return response.sendStatus(500);
};