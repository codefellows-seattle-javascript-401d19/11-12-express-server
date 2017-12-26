# Vanilla HTTP REST Server

This is a simple HTTP server which follows REST constraints, that allows users to input a url to GET, PUT, or DELETE a planet form a  local json database! It contains tests to make sure that the RESTful operations worked properly.

## Routes Explanation

Document all of your server endpoints. Explain expected HTTP request input and the corresponding server responses. Also explain server responses for bad requests and server errors.

### URL: /api/planet?id={**_id_**}

#### GET: 
  - If a valid **id** is given:
    - Server response: _object with that Planet's properties as key:value pairs from the database and a 200 status code_
  - If **_NO id_** is given:
    - Server response: _array of all the Planets in the database and a 200 status code_
  - If the **_id is incorrect or does not exist_** in the database:
    - Server response: _404 error_
#### POST: 
  - If a valid **id** is given:
    - Server response: _stores the new Planet in the database and sends a 200 status code_
  - If the **_id is incorrect or was not given_**:
    - Server response: _400 error_
    - Server response: _404 error_
#### DELETE: 
  - If a valid **id** is given:
    - Server response: _deletes the planet from the database and sneds a 200 status_
  - If the **_id is incorrect or was not given_**:
    - Server response: _404 error_ Item Not Found



## Build status

<!-- Build status of continus integration i.e. travis, appveyor etc. Ex.  -->
Status: Working


## Code style

js-standard-style

<!-- ## Screenshots

![Chat Room Example](https://raw.githubusercontent.com/SethDonohue/06-tcp-server/seth-lab/lab-seth/img/TCP-Chat-Server.png) -->

## Tech/framework used
- Eslint
- Node
- jest
- superagent
- dotenv
- Winston
- Faker
- Javascript /ES6


#### Built with

VScode

## Features

- It uses Winston Logger to keep track of logs.
- GET, POST, DELETE routes for newly discovered exo-planets
- Uses Faker to fake information fo rtesting purposes
- Tests populate the databse with 5 planets, then runs 7 tests to make sure all routes work and respond properly with good and bad inputs

## Code Example

### Routes Example
```

router.post('/api/planet', (request,response) => {
  if(!request.body){
    sendStatus(response,400,'body not found');
    return;
  }
  if(!request.body.name){
    sendStatus(response,400,'name not found');
    return;
  }
  if(!request.body.content){
    sendStatus(response,400,'content not found');
    return;
  }
  let planet = new Planet(request.body.name,request.body.content);
  planets.push(planet);
  sendJSON(response,200,planet);
});

router.get('/api/planet', (request,response) => {
  if(!request.url.query.id){
    sendJSON(response,200,planets);
    return;
  }
  if (!(planets.find(planet => planet.id === request.url.query.id))) {
    sendStatus(response, 404, 'Planet ID not found');
    return;
  } else {
    sendJSON(response, 200, planets[0]);
    return;
  }
});

router.delete('/api/planet', (request, response) => {
  if (!request.url.query.id) {
    sendStatus(response, 400, 'NO request id found');
    return;
  }
  if (!(planets.find(planet => planet.id === request.url.query.id))) {
    sendStatus(response, 404, 'Planet not found in database');
    return;
  } else {
    planets.filter(planet => planet.id !== request.url.query.id);
    sendJSON(response, 204, 'Planet removed succesfully');
    return;
  }
});

```
###Storage Example

```
storage.fetchItem = (id) => {
  logger.log('verbose', `STORAGE - fetching an item with id ${id}`);
  
  return storage.fetchAll()
    .then(database => {
      return database.find(planet => planet.id === id);
    })
    .then(planet => {
      if (planet === undefined)
        throw new Error('__STORAGE_ERROR_ item not found');
      return planet;
    });
};


storage.deleteItem = (id) => {
  logger.log('verbose', `STORAGE - deleting an item with id ${id}`);
  return storage.fetchAll()
    .then(database => {
      return [database.filter(item => item.id !== id),database.length];
    })
    .then(filteredItemsArr => {
      if(filteredItemsArr[0].length !==  (filteredItemsArr[1]-1))
        throw new Error('__STORAGE_ERROR_ item not found');
      return fsExtra.writeJSON(process.env.STORAGE_PATH, filteredItemsArr[0]);
    });
};
```

## Installation
1. ) Get source code from github (https://github.com/SethDonohue/08-09-vanilla-rest-server/tree/seth-lab-9)
2. ) In terminal navigate to 'lab-seth' folder and run following commands:
```
npm init -y
npm install
npm install -D jest eslint superagent
npm install -s winston faker dotenv uuid
```

<!-- Provide step by step series of examples and explanations about how to get a development env running. -->

## API Reference

Docs in Progress

## Tests

- Confirms a 200 status code on a proper POST request
- Confirms a 400 status code when an improper POST request is made

- Confirms a 200 status code on a proper GET request
- Confirms a 400 status code when an improper GET request is made

- Confirms a 200 status code on a proper DELETE request
- Confirms a 400 status code when an improper DELETE request is made

#### To Run Tests, run these commands in terminal from lab-seth folder

- npm run test
  - this will populate the database with five examples first then run tests on on the routes

## How to use?

1. ) In terminal navigate to lab-seth folder
2. ) In terminal run 'npm run test' to test server routes
<!-- If people like your project they’ll want to learn how they can use it. To do so include step by step guide to use your project. -->

## Contribute

<!-- Let people know how they can contribute into your project. A contributing guideline will be a big plus. -->

## Credits

- Winston
- Node
- dotenv
- Faker
- suepragent
- jest
- uuid
- Classmates that helped me!
<!-- Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project.

Anything else that seems useful -->

## License

#### MIT © Seth Donohue