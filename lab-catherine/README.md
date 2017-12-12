# Code Fellows: Seattle 401 JavaScript - 401d19

##  Lab 11: Express and Mongo REST API

### Author:
 Catherine Looper

### Motivation

In this project, I built a RESTful (Hypertext Transfer Protocol) HTTP server using Express. This server handles GET, POST, and DELETE requests/responses. This API uses MongoDB and Mongoose to write data to a db directory for persistence.

### Build

#### Server Module

The server module is creating an http server, defining server-on behavior and exporting an interface for starting and stopping the server. The server module exports an object containing start and stop methods.

The server module requires in express, mongoose, logger and the book-router.js file. The server.start and stop methods return a new Promise with resolve and reject parameters. The start method contains an app.listen function that listens for the server start. The server.stop method has an httpServer.close function that turns the server off by setting the isServerOn variable to false.

#### Route Module

##### ```book-router.js```

book-router.js requires in the Router object from express, the jsonParser, the logger module  and book.js. Inside the module, there are functions declared for bookRouter.post, bookRouter.get and bookRouter.delete. These methods each handle their corresponding method and send the appropriate response based on the input. The bookRouter is exporting a new Router instance.

#### Model Module

The model module contains a book.js file that requires in mongoose and has a bookSchema with the properties: title, author, genre, content, and timestamp. The mongoose.model is being exported from this file.

#### Test Module

server.test.js contains tests for POST, GET, and DELETE methods.

### Limitations

To use this app - it is assumed that the user has familiarity with the tech and frameworks listed below. 

### Code Style

Standard JavaScript with ES6

### Tech/Framework used

* JavaScript / ES6
* Node.js
* Jest
* Eslint
* MongoDB
* Mongoose
* Winston
* Express
* Superagent
* Dotenv
* Body-Parser
* Faker

### How to use?

* Step 1. Fork and Clone the Repository.
* Step 2. ```npm install```.
* Step 3. touch a ```.env``` file and add the following to the file: ```PORT=3000``` and ```MONGODB_URI=mongodb://localhost/testing```.
* Step 4. start MongoDB by calling ```npm run dbon```.
* Step 5. to test the API, open a second terminal window and run the command ```npm run test```.

### Credits

* Code Fellows / Vinicio Vladimir Sanchez Trejo for providing the demo code as reference.

### License

MIT © Catherine Looper