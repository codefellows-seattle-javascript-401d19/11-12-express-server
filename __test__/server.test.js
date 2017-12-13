'use strict';

process.env.PORT = 3424;
process.env.MONGODB_URI = `mongodb://localhost/testing/`;

const fake = require('faker');
const superagent = require('superagent');
const Plant = require(`../model/plant`);
const server = require(`../lib/server`);

const apiUrl = `http://localhost:${process.env.PORT}/api/notes`;
