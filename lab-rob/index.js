'use strict';

require('dotenv').config();
require('./lib/server')
  .start()
  .then(() => {
    console.log(`Server running on port ${process.env.PORT}`);
  })
  .catch(console.log);