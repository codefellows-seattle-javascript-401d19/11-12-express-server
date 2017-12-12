'use strict';

const mongoose = require('mongoose');

const heroSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  description : {
    type : String,
    required : true,
    minlength : 10,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
});

module.exports = mongoose.model('hero', heroSchema);
