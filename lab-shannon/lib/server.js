'use strict';

const logger = require(`./logger`);
const mongoose = require(`mongoose`);
const express = require(`express`);

const app = express();
let serverIsOn = false;
let httpServer = null;

mongoose.Promise = Promise;

app.use(require(`./loggerMiddleware`));
app.use(require(`../route/sweet-router`));
app.all(`*`, (request, response) => {
  logger.log(`info`, `Something went wrong with the request. Sending a 400 status to the catch-all route`);
  return response.sendStatus(400);
});

app.use(require(`./errorMiddleware`));
//---------------------------------------------------------------------------------------
const server = module.exports = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if(serverIsOn){
      logger.log(`info`, `__SERVER_ERROR__ the server is already on`);
      return reject(new Error(`__SERVER_ERROR__ the server is already on`));
    }
    httpServer = app.listen(process.env.PORT, () => {
      logger.log(`info`, `Turning the server on. Listening on port ${process.env.PORT}`);
      console.log(`Listening on port ${process.env.PORT}`);
      serverIsOn = true;
      return resolve();
    });
  })
    .then(() => mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}));
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!serverIsOn){
      logger.log(`info`, `__SERVER_ERROR__ the server is already off`);
      return reject(new Error(`__SERVER_ERROR__ the server is already off`));
    }
    if(!httpServer){
      logger.log(`info`, `__SERVER_ERROR__ there is no server to close`);
      return reject(new Error(`__SERVER_ERROR__ there is no server to close`));
    }
    httpServer.close(() => {
      serverIsOn = false;
      httpServer = null;
      logger.log(`info`, `Turning the server off now`);
      return resolve();
    });
  })
    .then(() => mongoose.disconnect());
};
