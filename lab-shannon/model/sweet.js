'use strict';

const mongoose = require(`mongoose`);

// a schema is "a representation of a plan or theory in the form of an outline or model"- we're saying how our sweet will look/behave
const sweetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hasChocolate: {
    type: Boolean,
    required: true
  },
  temperature: {
    type: String,
    required: true
  },
  seasonal: {
    type: Boolean,
    required: false
  }
});

// A model is a class with which we construct documents (explanation from mongoose docs);
module.exports = mongoose.model(`sweet`, sweetSchema);
