# Code Fellows: Code 401d19: Full-Stack JavaScript

## Lab 11: Express and Mongo REST API

The purpose of this lab is to recreate our HTTP rest server from lab 08 using `express` and `mongo`.

## Tech/frameworks/packages

- node 
- npm
- node packages
  - jest
  - eslint 
  - superagent
  - express
  - mongoose
  - dotenv
  - body-parser
  - winston
  - mongoose
- mongodb

## How to use?
Clone this repo, cd into `lab-rob`, run `npm install`. 

Touch `.env` in `lab-rob` and add `PORT=<you-desired-port>` and `MONGODB_URI=mongodb://localhost/testing`.

Run `npm start` to start the server.

Make POST/GET/DELETE/PUT requests to the server to interact with the database.

## Routes

#### `POST /api/bikes`

Send a JSON object with the properties `make` (String), `model` (String), `year` (Number), `displacement` (Number)

Throws an error if any of the requested properties are missing.

Add a new bike to the database. Returns a bike object with `timestamp` and `_id` properties.

#### `GET /api/bikes`

Get an array of all bikes in the database.

#### `GET /api/bikes/<bike id>`

Return a specific bike as requested by the <bike id>.

If a bike with that id is not found, a 404 is returned.

#### `DELETE /api/bikes/<bike id>`

Delete a specific bike as requested by the <bike id>. If successful, a 204 code is sent.

If a bike with that id is not found, a 404 is returned.

#### `PUT /api/bikes/<bike id>`

Update a specific bike's properties by id. You can only change the original properties listed in the POST notes above.

If successful, the bike is returned with a 200 status.

If a bike with that id is not found, a 404 status is returned.

## Tests

run `npm test` to check tests.

If tests spontaneously fail, try running it again, you may get lucky!

#### POST

1. should respond with a bike and 200 status code if there is no error.
1. should respond with a 400 status code if incomplete data is sent.

#### GET

1. should respond with a specific bike and 200 status code if there is no error.
1. should respond with a 404 status code if no bike with the given id exists.
1. should respond with an array of all bikes and 200 status code if there is no error.

#### DELETE

1. should respond with a 204 status code if there is no error.
1. should respond with a 404 status code if the id is of bad form.
1. should respond with a 404 status code if the id is not found.
1. should respond with a 400 status code if no id is provided.

#### PUT

1. should respond with a 200 status code and the updated bike.
1. should respond with a 400 status code if no relevant properties are sent.
1. should respond with a 404 status code requested id not found.

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits

Initial codebase created by Vinicio Vladimir Sanchez Trejo.

## License

MIT. Use it up!