## Purpose
The purpose of this project is to create a RESTful HTTP server utilizing express, mongoose, and mongoDB which can create, access, and delete Sweet objects. Middleware is used to handle errors encountered.

## How To use
* First install the dependencies by running 'npm install'.
* Run the command 'npm run dbon' to connect to the database and establish a connection.
* IN A DIFFERENT TAB of the terminal install jest for testing by running "npm i -s jest". You will then be able to use the command 'npm test' to execute all tests in the test files.

## Request Handlers
1. GET without id- this request is handled by the route /api/sweets. It returns an array of every sweet stored in the database.
2. GET with id- this request is handled by the route /api/sweets/id_provided. It will return the sweet with the id that matches the id provided. If no matching sweet is found a 404 error is returned.
3. POST- this request is handled by the route /api/sweets. You must send a valid Sweet object with the POST request. A valid object has four properties: name (String), hasChocolate (Boolean), temperature (String), and seasonal (Boolean). Only the seasonal property is optional. A successful POST request will return a 200 status. If there was a problem with the request (i.e. a required property was omitted) a 400 status is returned.
4. DELETE- this request is handled by the route /api/sweets/id_provided. An id must be provided or a 400 error will occur. If there is no Sweet with the id provided a 404 error will occur. If the DELETE request is successful a 204 status will be returned.

## Technologies Used
* ES6
* node
* winston
* eslint
* faker
* dotenv
* mongoose
* mongodb
* express
* jest
* superagent
* body-parser
* http-error
* Middleware files for handling & logging errors (errorMiddleware.js & loggerMiddleware.js, respectively)

## License
MIT

## Credits
* Vinicio Vladimir Sanchez Trejo & the Code Fellows curriculum provided the base .eslintrc, .eslintignore, .gitignore, index.js, log.json, and server.js files upon which the command functions were built.

* My fellow 401JS classmates, the TAs, and Vinicio for help problem solving and debugging.
