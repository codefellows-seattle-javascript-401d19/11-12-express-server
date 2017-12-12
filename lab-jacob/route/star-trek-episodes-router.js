'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const starTrekEpisodes = require('../model/star-Trek-episodes');
const logger = require('../lib/logger');
const starTrekEpisodesRouter = module.exports = new Router();

