 'use strict';

const faker = require('faker');
// vinicio - mongoose is the ORM to connect to mongo
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
  discoverDate: {
    type: Date,
    default: faker.date.past(),//() => new Date(),
  },
});

// vinicio - internally, this becomes 'planets'
module.exports = mongoose.model('planet', planetSchema);