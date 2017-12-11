'use strict';

const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: 'int',
    required: true,
  },
  displacement: {
    type: 'int',
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model('bike', bikeSchema);