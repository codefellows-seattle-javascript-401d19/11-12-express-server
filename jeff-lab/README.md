# Code Fellows 401 Lab 10
The purpose of this lab is to build a basic HTTP server using the Express library that takes GET, POST, and DELETE requests that read, add, and delete an object from an array.  The object is a sports team with 5 properties: sport, city, nickname, the date entered, and id (which is assigned by the API).  The data is stored on a MongoDB database.  Mongoose is used to interface between the server and Mongo.

## Code Style
Standard Javascript with ES6.

## Features
Users can get a list of all teams by sending a GET request with no body.  To get a particular team, send a GET request with a body of ```{id: '<id of team you want>'}```
To put a new team in the array, send a POST request with the body ```{sport: '<sport>', city: '<city>', nickname: '<nickname>'}```
To delete a team from the array, send a DELETE request with the body ```{id: '<id of team to delete>'}```.

## Running the Server
To run the server, download the repo.  Install dependencies via ```npm install```.  Create a folder called '.env' in the root directory of this project and enter ```PORT=<yourport>``` on the first line.  3000 is a typical choice.  Then, ```npm start```.

## Endpoints

### GET ('/api/teams')
Sent without a query.  
* Returns status 200 and an array of all the objects on the database.

### GET ('api/teams:id')
Sent with the query of an object with the key "id".  
* If the id is found on the database, returns status 200 and the object that matches that id.  
* If the id is not found on the database, returns status 404 and an error message.

### POST ('api/teams')
Sent with the query of an object with the keys sport, city, and nickname.
* If all keys are there, returns status 200 and the body of the object it just created with your data.  Will also include a unique id created by uuid.
* If any key is missing or misspelled or no body is sent, returns status 400 and an error message.

### DELETE ('api/teams/:id')
Sent with the query of an object with the key "id".
* If sent correctly, returns with status 200.
* If no body is sent, returns with status 400 and an error message.
