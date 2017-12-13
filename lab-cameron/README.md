# Express and Mongo REST API

A simple HTTP Server using Express with MongoDB for persistence

# Tech Used

- Node.js
- Express
- MongoDB
- mongoose ORM
- body-parser
- dot-env
- winston
- faker
- jest
- superagent
- http-error

# Features

GET, POST, and DELETE requests on path `/api/userAccounts/<user-id>`

All user accounts have a mongoose Schema which include a `name`, a `description`,
and an optional `location` property.

# Code Example / API Reference

### POST
`POST /api/userAccounts` will add a single user in MongoDB; responds with 200 status code

Bad requests will respond with a 400 status code

### GET
`GET /api/userAccounts` will return all users in MongoDB as an array; responds with 200 status code
`GET /api/userAccounts/<user-id>` will return a single user with the specified id; responds with 200 status code

Bad requests with incorrect id will respond with a 404 status code

### DELETE
`DELETE /api/userAccounts/<user-id>` will delete a single user from MongoDB with the specified id; responds with 204 status code

Bad requests with invalid id's will respond with a 404 status code
Bad requests without any id at will will respond with a 400 status code

# Installation

1. clone this repo
2. Setup PORT and MongoDB URI in .env file
3. run `npm run dbon` to turn on MongoDB
4. run `npm run dboff` to turn off MongoDB

# Tests

All unit tests and mocks done using jest, faker and superagent

# Credits

Cameron Moorehead - https://github.com/CameronMoorehead

# License

GPL-3.0
