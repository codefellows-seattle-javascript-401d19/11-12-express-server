##Lab 10 - HTTP REST Server

##Objective
To make a lightweight, RESTFUL server which has GET, POST, and DELETE CRUD methods and tests which verify common functionality of these methods.  Furthermore, a connection with a Mongo DB instance is created and information may be stored for later retrieval.  The object created for storage is a Bicycle with a schema identifying the brand, model, and discipline it is intended for.  Mongo auto generates a unique ID and timestamp which follow the object into the DB.

#### Code Style
-Node.js (ES6 notation where possible)
-NPM Dependencies (body-parser, dotenv, express, mongoose, winston)
-Development NPM packages (eslint, faker, jest, and superagent)

## How to Use

To start this app, clone this repo from 

  `http://www.github.com/kerrynordstrom/11-express-server`

install all necessary packages with 

  `npm install`

Start the Mongo DB server by running the command 

  `npm dbon`

And run any available tests with

  `npm run test`

##Middleware

###Logging 
Logging is handled by the logger middleware, which parses out request methods and URLs into log JSON and also to the console.  These details are generally removed from the base code and are required by express in the server file.

###Error Handling

Errors are handled by the error middleware, which parses out error statuses and messages into log JSON and also to the console.  These details are generally removed from the base code and are required by express in the server file.

## Server Endpoints

* `GET /api/bicycles` 
* Returns an array of all bicycles in the Mongo DB when run with no id as parameter.
* Returns 200 success message on completion.

* `GET /api/bicycles/:id` 
* Returns a single bicycle in JSON form from the Mongo DB when run with a valid id as an argument.
* Returns a 200 success status code if id is found.
* Returns a 404 failure status code if id is not found.
* `POST /api/bicycles`
  * Creates another instance of a bicycle when stringified data is passed through POST route
  * Returns a 200 success status code if insertion is completed
  * Returns a 400 failure status code if either the Brand or Model are missing from the request.
  * Returns a 500 failure status code if any errors are found in the request unrelated to the request body.
* `DELETE /api/bicycles/:id` 
  * Deletes a single bicycle from the Mongo DB when run with a valid id as argument
  * Returns a 204 success status code if deletion is completed
  * Returns a 400 failure status code if id is missing from request
  * Returns a 404 failure status code if invalid id is included in request
