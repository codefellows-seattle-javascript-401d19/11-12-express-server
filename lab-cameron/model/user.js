'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model('note', userSchema);
