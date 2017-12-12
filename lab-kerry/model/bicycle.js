'use strict';

//mongoose is the ORM to connect to mongo
const mongoose = require('mongoose');

const bicycleSchema = mongoose.Schema ({
  Brand: {
    type: String,
    required: true,
    unique: false,
    maxlength: 50,
  },
  Model: {
    type: String,
    required: true,
    unique: false,
    maxlength: 50,
  },
  Discipline: {
    type: String,
    required: false,
    unique: false,
    maxlength: 50,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

//internally, this becomes 'notes';
module.exports = mongoose.model('bicycle', bicycleSchema);