'use strict';

const faker = require('faker');
const mongoose = require('mongoose');

const planetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
  },
});

module.exports = mongoose.model('planet', planetSchema);