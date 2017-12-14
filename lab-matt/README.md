# 12: Express-Server
Description: **Lab 12 of Code Fellows JavaScript 401d19** </br>
Author: **Matthew LeBlanc** </br>
Date: **12/12/17**

## Updates
v1.0.1 - Lab_12: Added PUT feature and GET route to receive All Dogs

## Features
This lab implements creation of an http server using express.js

## Usage
1. Make sure to `npm install` the dependency packages
2. setup a `.env` folder with the values
  - PORT=3000
  - MONGODB_URI=mongodb://localhost/testing
3. Run `npm run test` to run the jest testing

## Server Endpoints
1. `POST /api/dogs` - Create a new dog data
2. `GET /api/dogs/<id>` - retrieve a saved dog based on ID
3. `PUT /api/dogs/<id>` - update a saved dog based on ID
4. `DELETE /api/dogs/<id>` - delete a saved dog based on ID