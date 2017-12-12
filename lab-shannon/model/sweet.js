'use strict';

const mongoose = require(`mongoose`);

// a schema is "a representation of a plan or theory in the form of an outline or model"- we're saying how our sweet will look/behave
const sweetSchema = mongoose.Scheme({
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
    type: String,
    required: false
  }
});

// A model is a class with which we construct documents (explanation from mongoose docs);
module.exports = mongoose.model(`sweet`, sweetSchema);
