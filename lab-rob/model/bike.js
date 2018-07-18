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
    type: Number,
    required: true,
  },
  displacement: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model('bike', bikeSchema);