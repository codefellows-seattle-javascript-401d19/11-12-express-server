'use strict';

const mongoose = require('mongoose');

const userAccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  location: {
    type: String,
    required: false,
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model('userAccount', userAccountSchema);
