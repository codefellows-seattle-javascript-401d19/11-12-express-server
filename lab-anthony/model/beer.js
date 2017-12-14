'use strict';

const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  brewery: {type: String, required: true,  unique: true},
  beer: {type: String, required: true, minlength: 1},
  style: {type: String, required: false, minlength: 1},
  timestamp: {type: Date, default: () => new Date()},
});

module.exports = mongoose.model('beer', beerSchema);
