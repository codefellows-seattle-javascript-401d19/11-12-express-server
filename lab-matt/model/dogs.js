'use strict';

const mongoose = require('mongoose');

const dogSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  legs: {
    type: Number,
    require: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),  
  }, 
});

module.exports = mongoose.model('dog', dogSchema);