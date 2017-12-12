'use strict';

require('dotenv').config();
const express = require('express');
const logger = require('./logger');
const mongoose = require('mongoose');

const PORT = process.env.PORT;

let isServerOn = false;
let httpServer = null;

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient : true});

const app = express();

app.use(require('../route/cat-router'));

app.all('*', (request, response) => {
  logger.log('info','Returning a 404 from the catch-all route');
  return response.sendStatus(404);
});

const server = module.exports = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if(isServerOn){
      logger.log('error', '__SERVER_ERROR__ server is already running');
      return reject(new Error('__SERVER_ERROR__ server is already running'));
    }
    if(!PORT){
      logger.log('error', '__SERVER_ERROR__ PORT variable is not configured');
      return reject(new Error('__SERVER_ERROR__ PORT variable is not configured'));
    }
    httpServer = app.listen(PORT, () => {
      isServerOn = true;
      console.log(`Server is listening on port ${PORT}`);
      logger.log('info',`Server is listening on port ${PORT}`);
      return resolve();
    });
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!isServerOn){
      logger.log('error', '__SERVER_ERROR__ server is already off');
      return reject(new Error('__SERVER_ERROR__ server is already off'));
    }
    if (!httpServer){
      logger.log('error', '__SERVER_ERROR__ server can\'t be shut down, server does not exist');
      return reject(new Error('__SERVER_ERROR__ there is no server to close'));

    }
    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      logger.log('info', 'Server is off');
      return resolve();
    });
  });
};
