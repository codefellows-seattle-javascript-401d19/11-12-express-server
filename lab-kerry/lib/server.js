'use strict';

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');

const app = express();
let isServerOn = false;
let httpServer = null;

// -----------------------------------
//Setting up MongoDB and Mongoose
// -----------------------------------
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
// -----------------------------------
//Setting up routes below
// -----------------------------------
app.use(require('../route/bicycle-router'));

//the catch-all should be at the end of all routes

app.all('*', (request, response) => {
  logger.log('info', 'Returning a 404 from the catch all route.');
  return response.sendStatus(404);
});
// -----------------------------------


const server = module.exports = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if (isServerOn) {
      logger.log('error', '__SERVER_ERROR__ Server is already on')
      return reject(new Error('__SERVER_ERROR__', 'Server is already on'));
    }
    httpServer = app.listen(process.env.PORT, () => {
      isServerOn = true;
      console.log(`Server is listening on port ${process.env.PORT}`);
      logger.log(`Server is listening on port ${process.env.PORT}`);
      return resolve();
    })
  });
};
server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!isServerOn) {
      logger.log('error', '__SERVER_ERROR__ Server is already off')
      return reject(new Error('__SERVER_ERROR__ Server is already off'));
    }
    if (!httpServer) {
      logger.log('error', '__SERVER_ERROR__ There is no server to close')
      return reject(new Error('__SERVER_ERROR__ There is no server to close'));
    }
    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      logger.log('info', 'Server off');
      return resolve();
    });
  });
};