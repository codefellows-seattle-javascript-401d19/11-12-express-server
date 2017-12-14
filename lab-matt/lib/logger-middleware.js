'use strict';

const log = require('./logger');

module.exports = (request, response, next) => {
  log('info', `Processing: ${request.method} ON: ${request.url}`);
  return next();
};