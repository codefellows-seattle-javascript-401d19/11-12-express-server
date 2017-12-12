'use strict';

const logger = require(`./logger`);

module.exports = (error, request, response, next) => {
  logger.log(`info`, `Processing a ${request.method} request from ${request.url} and sending ${response.body}`);
  return next();  // you MUST include this or the next part of your code (i.e. the ACTUAL program) won't run
}
