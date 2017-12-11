'use strict';

const logger = require(`./logger`);
const mongoose = require(`mongoose`);
const express = require(`express`);

const app = express();
let serverIsOn = false;
let httpServer = null;

// because mongoose is older than the ES6 Promise we have to tell mongoose what Promise we're using
mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

app.use(require(`../route/sweet-router`));
app.all(`*`, (request, response) => {
  logger.log(`info`, `Something went wrong with the request. Sending a 400 status`);
  return response.sendStatus(400);
})

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
    })
  });
};

server.stop = () => {

};
