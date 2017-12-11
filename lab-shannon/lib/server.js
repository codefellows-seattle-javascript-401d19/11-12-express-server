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
