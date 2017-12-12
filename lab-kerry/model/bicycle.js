'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');

const bicycleSchema = mongoose.Schema ({
  Brand: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  Model: {
    type: String,
    required: true,
    unique: false,
    maxlength: 50,
  },
  Type: {
    type: String,
    required: false,
    maxlength: 50,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

//internally, this becomes 'notes';
module.exports = mongoose.model('bicycle', bicycleSchema);