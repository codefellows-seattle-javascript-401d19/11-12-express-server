'use strict';

const logger = require('./logger');

module.exports = (error,request,response,next) => {

  logger.log('info', '__ERROR_MIDDLEWARE__');
  logger.log('info', error);

  if(error.status)
}