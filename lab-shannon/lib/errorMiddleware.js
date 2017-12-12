`use strict`;

module.exports = (error, request, response, next) => {
  logger.log(`info`, `We've hit the __ERROR_MIDDLEWARE__`);
  logger.log(`info`, error);

  // HTTP ERRORS
  if(error.status){
    logger.log(`info`, `Responding with a ${error.status} and the message ${error.message}`);
    return response.sendStatus(error.status);
  }

  // MONGO ERRORS
  
}
