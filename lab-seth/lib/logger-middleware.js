'use strict';

const logger = require('./lib/logger');

module.exports = (request, response, next) => {
  logger.log('info', `Processing : ${request.method} on : ${request.url}`);
  console.log(`Processing : ${request.method} on : ${request.url}`);
  return next(); // need to call this or the chain will break
};