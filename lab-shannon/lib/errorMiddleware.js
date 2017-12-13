`use strict`;

const logger = require(`./logger`);

module.exports = (error, request, response, next) => {
  logger.log(`info`, `We've hit the __ERROR_MIDDLEWARE__`);
  logger.log(`info`, error);

  //---------------------------------------------------------------------------------
  // HTTP ERRORS
  //---------------------------------------------------------------------------------
  if(error.status){
    logger.log(`info`, `Responding with a ${error.status} and the message ${error.message}`);
    return response.sendStatus(error.status);
  }

  //---------------------------------------------------------------------------------
  // MONGO ERRORS
  //---------------------------------------------------------------------------------
  let errorMessage = error.message.toLowerCase();

  if (errorMessage.includes(`validation failed`)){
    console.log(`sending a 400 status via mongo`);
    return response.sendStatus(400);
  }else if(errorMessage.includes(`duplicate key`)){
    console.log(`sending a 409 status via mongo`);
    return response.sendStatus(409);
  }else if(errorMessage.includes(`objectid failed`)){
    console.log(`sending a 404 status via mongo`);
    return response.sendStatus(404);
  }else if(errorMessage.includes(`unauthorized`)){
    console.log(`sending a 401 status via mongo`);
    return response.sendStatus(401);
  }else{
    console.log(`sending a 500 status via mongo`);
    return response.sendStatus(500);
  }
}
