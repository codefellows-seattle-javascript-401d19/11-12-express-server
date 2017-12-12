'use strict';

const logger = require('./logger');

module.exports = (request, response, next) => {
  logger.log('info', `Processing : ${request.method} on : ${request.url}`);
  console.log(`Processing : ${request.method} on : ${request.url}`);
  return next(); // we need to call at the end of middleware chain or will break
};