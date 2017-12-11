'use strict';

const mongoose = require('mongoose');

const mountainSchema = mongoose.Schema({
  title: {
    type : String,
    required : true,
    unique : true,
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

module.exports = mongoose.model('mountain', mountainSchema);