![cf](https://i.imgur.com/7v5ASc8.png) Express and Mongo REST API + Middleware
======

* Create HTTP rest server using express and mongo with adding middleware to handle errors.

  * display all data (GET method)
  * display single object from database if correct id is passed to the request  (GET method)
  * add object to database (POST method)
  * update object in our database (PUT method)
  * delete object from the database (DELETE method)

## Code Style
* Javascript + ES6, Express JS, Mongodb, Mongoose


## Tech / framework used
* [npm package faker](https://www.npmjs.com/package/faker) creating random generated text.
* [npm package http-errors](https://www.npmjs.com/package/uuid) to handle HTTP request/response error.
* [npm package winston](https://www.npmjs.com/package/winston) as a logging library.
* [npm package jest](http://facebook.github.io/jest/) used for TDD
* [npm package dotenv](https://www.npmjs.com/package/dotenv) for loading env variables.
* [npm package superagent](https://www.npmjs.com/package/superagent) for testing http requests


## Installation and How To Use

  * Fork || clone this repo to you computer.

  * Run `npm install`

  * Create .env file and add `PORT=<port>` and `MONGODB_URI=mongodb://localhost/testing`.

  * Make POST, GET, PUT and DELETE request to the server.



## Routes

  * Use **POST** `/api/heroes/` to add more heroes into db:

     * sends new JSON object that has following properties: `name`, `description`, `timestamp` and unique `id`. Name and description properties are **required**.

     * if `name` or `description` is left out, 400 status code will be returned.


 * Use **GET** `/api/heroes/<hero id>` to fetch specific hero by its id from db:

    * Returns hero with requested id.

    * If ID is invalid - it will return 404 status code error.

* Use **DELETE** `/api/heroes/<hero id>` to delete specific hero by its id from db:

   * Deletes hero with requested id and returns 204 successful status code.

   * If hero ID is invalid/not found - it will return 404 status code error.

* Use **PUT** `/api/heroes/<hero id>` to delete specific hero by its id from db:

  * Updates hero properties if hero ID is valid and returns 200 successful status code.

  * If hero ID or hero `name` and `description` property is invalid/not found - it will return 404 status code error.


## Licence
MIT © Pedja Josifovic
