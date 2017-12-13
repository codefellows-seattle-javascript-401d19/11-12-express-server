'use strict';

const mongoose = require("mongoose");

const wizardSchema = mongoose.Schema({
    title:{
        type: String,
        require : true,
        unique: true,
    },
    content : {
        type : String,
        required: true,
        minlength: 10,
    },
    timestamp : {
        type : Date,
        default : () => new Date(),
    }
});

module.exports = mongoose.model('wizard',wizardSchema);

