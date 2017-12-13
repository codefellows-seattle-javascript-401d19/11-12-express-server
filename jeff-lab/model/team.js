'use strict';

const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  sport : {
    type : String,
    required : true,
  },
  city : {
    type : String,
    required : true,
  },
  timestamp : {
    type : Date,
    default : () => new Date(),
  },
  nickname : {
    type: String,
  },
});

module.exports = mongoose.model('team',teamSchema);
