'use strict';

console.log(`!!! Server.js hit`);

const express = require('express');
const mongoose = require('mongoose');
//const logger = require('./logger');  //TODO: Path here is correct?
const plantRoutes = require('../route/plant-router');

const app = express();
let isServerOn = false;
let httpServer = null;




mongoose.Promise = Promise; //TODO: What is this?
mongoose.connect(process.env.MONGODB_URI,{useMongoClient : true}); //TODO: Where is this getting MONGODB_URI?

app.use(plantRoutes); //TODO: What is App.use.

app.all('*', (request, response) => {
  console.log('info','CATCH-ALL | Returning 404');
  return response.sendStatus(404);
});

const server = module.exports = {}; //TODO - test this in console.

server.start = () => {
  return new Promise((reject, resolve)=>{
    if(isServerOn){
      console.log('error',`SERVER ERROR | Attempted to start server when server was already 'on'`);
      return reject(new Error(`SERVER ERROR | Attempted to start server when server was already 'on'`));
    }
    httpServer = app.listen(process.env.PORT, () => { //TODO: Look up app.listen - why is this function in 'callback' structure?
      isServerOn = true;
      console.log('info',`SERVER has started. Listening on port ${process.env.PORT}`);
      return resolve();
    });
  });
};

server.stop = () => {
  return new Promise((reject, resolve)=>{
    if(isServerOn===false){
      console.log('error',`SERVER ERROR | Attempted to close server when server was already 'off'`);
      return reject(new Error(`SERVER ERROR | Attempted to close server when server was already 'off'`));
    }
    if(!httpServer){
      console.log('error',`SERVER ERROR | Cannot close server - server object is null`);
      return reject(new Error('SERVER ERROR | Cannot close server - server object is null'));
    }
    httpServer.close(()=>{ //TODO: ditto here - look up express.close. Why does this function have a callback structure.
      isServerOn = false;
      httpServer = null;
      console.log('info','Server succesfully closed.');
      return resolve();
    });
  });
};
