'use strict';

const mongoose = require('mongoose');

const plantSchema = mongoose.Schema({
  scientificName : {
    type : String,
    required : true,
    unique : true,
  },
  commonNames : {
    type : String,
    required : false,
    unique : false,
  },
  floraType : {
    type : String,
    required : true,
    unique : false,
  },
  entryDate : {
    type : Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model('plant', plantSchema);
