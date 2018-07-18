'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const app = express();
let isServerOn = false;
let httpServer = null;

const server = module.exports = {};

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

app.use(require('../route/bike-router'));
app.all('*', (request, response) => {
  logger.log('info', 'Returning a 404 from the catch all route');
  return response.sendStatus(404);
});

server.start = () => {
  return new Promise((resolve, reject) => {
    if(isServerOn) {
      logger.log('error', '__SERVER_ERROR__ Server is already on.');
      return reject(new Error('__SERVER_ERROR__ Server is already on.'));
    }
    httpServer = app.listen(process.env.PORT, () => {
      isServerOn = true;
      logger.log(`Server running on port ${process.env.PORT}.`);
      return resolve();
    });
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!isServerOn) {
      logger.log('error', '__SERVER_ERROR__ Server is already off');
      return reject(new Error('__SERVER_ERROR__ Server is already off'));
    }
    if(!httpServer) {
      logger.log('error', '__SERVER_ERROR__ There is no running server to close');
      return reject(new Error('__SERVER_ERROR__ There is no running server to close'));
    }
    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      logger.log('info', 'Server is off.');
      return resolve();
    });
  });
};