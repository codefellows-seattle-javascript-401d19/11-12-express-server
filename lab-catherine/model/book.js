'use strict';

const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title : {
    type : String,
    required : true,
    unique : true,
  },
  author: {
    type : String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  content : {
    type : String,
    required : true,
    minlength : 10,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
});

module.exports = mongoose.model('book', bookSchema);