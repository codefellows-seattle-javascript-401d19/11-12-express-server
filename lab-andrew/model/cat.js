'use strict';

const mongoose = require('mongoose');

const catSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  says : {
    type : String,
    required : true,
    minlength : 5,
  },
  birthday : {
    type : Date,
    default : () => new Date(),
  },
});

module.exports = mongoose.model('cat', catSchema);
