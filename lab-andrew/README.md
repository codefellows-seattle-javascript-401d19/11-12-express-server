# Lab 12 Express Middleware

## Overview

This API is a RESTful Cat API. It exists so you can create virtual cats and retrieve and delete them from memory. It is built using express and mongo.

## Getting Started

To get started using this application, familiarity with node and npm, as well as git is assumed. It is also assumed that you have a current version of mongodb. Fork/clone this repo to your machine, and do an `npm install`. You will need to set up a .env file (saved in the root directory of this project) with the PORT you would like to use (i.e. PORT=3000). To this file you should also add a MONGODB_URI variable set to the path to `mongodb://localhost/testing`.

Install jest if you do not have it globally installed with `npm i jest`. In the terminal, navigate to the project folder. Open another new tab in the terminal and in that tab run the command `npm run dbon`. To run the tests, in the original terminal tab type `npm run test`.

## Modules

There is a function from index.js which calls the server.js start function. There is a cat-router.js module, which contains most of the functionality of this app. It uses the cat.js model to create new Cat objects when a POST request is submitted. This uses the mongoose .save() method, which saves that object to mongodb. cat-router.js also supplies the functionality which returns the cats when a GET request is submitted, updates a specific cat when a PUT request is submitted, and deletes a cat when a DELETE request is submitted, and handles any errors. All that is exported from the server.js file is server.start and server.stop. There is a logger-middleware which is required in by express in the server. All requests to the API hit this logger which logs the actions in the log files. This then passes to the actual routing functionality (get, put, post and delete methods). If any errors occur during routing, they get passed to the error handling middleware (which is also required into express in server.js) which is parsed and handled from the modules exported from error-middleware.js.

## Making Requests to the API

To start the server run `npm run start`. To make a GET request, the path will be '__server_address__/api/cats', e.g. 'http://localhost:3000/api/cats', and an array of all cat objects will be returned with a success message. If an additional cat ID is supplied as a query string, a specific cat will be returned if that ID exists. A POST request can be made, which expects a JSON object in the form of '{"name":"`<cat's name>`","says":"`<what the cat says>`"}' and a new Cat will be created with a unique ID and a birthday (which calls the Date() method to document the time the Cat was created). A PUT request will work similarly to the POST request, however a valid cat ID must be supplied. A DELETE request can be made with the same route as a GET request with an ID; it will delete the cat which has that ID.

## Technology/Credits

Created by Andrew Bloom. This app is being logged with winston and is using superagent and jest for testing server requests. Server built with express and persistence managed by mongoose/mongodb.
