'use strict';

let PORT = process.env.PORT | 3000;

const faker = require('faker');
const superagent = require('superagent');
const Dog = require('../model/dogs');
const server = require('../lib/server');

const apiURL = `http://localhost:${PORT}/api/dogs`;

const dogMockCreate = () => {
  return new Dog({
    name: `${faker.name.firstName()}_${faker.name.lastName()}`,
    legs: faker.random.number({min: 1, max: 4}),
  }).save();
};

const dogMockMany = (amount) => {
  return Promise.all(new Array(amount)
    .fill(0)
    .map(() => dogMockCreate()));
};

describe('/api/dogs', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Dog.remove({}));

  // ===================== POST =====================
  describe('POST /api/dogs', () => {
    test('POST should respond with 200 and data if no error', () => {
      let dogToPost = {
        name: faker.name.firstName(),
        legs: faker.random.number({min: 1, max: 4}),
      };

      return superagent.post(`${apiURL}`)
        .send(dogToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(dogToPost.name);
          expect(response.body.legs).toEqual(dogToPost.legs);
        });
    });
    
    test('POST should respond with 400 status code if there is an incomplete object', () => {
      let dog = {legs: '4'};
      
      return superagent.post(`${apiURL}`)
        .send(dog)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });
  });

  // ===================== GET =====================
  describe('GET /api/dogs', () => {
    test('GET should respond with 200 and array of dogs, up to 10', () => {
      return dogMockMany(100)
        .then(() => {
          return superagent.get(`${apiURL}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body).toBeInstanceOf(Array);
        });
    });

    test('GET should respond with 404 if id is not found', () => {
      return superagent.get(`${apiURL}/1234`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });

  describe('GET /api/dogs/:id', () => {
    test('GET should respond with 200 and data if no error', () => {
      let dogToTest = null;

      return dogMockCreate()
        .then(dog => {
          dogToTest = dog;
          return superagent.get(`${apiURL}/${dog._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(dogToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(dogToTest.name);
          expect(response.body.legs).toEqual(dogToTest.legs);
        });
    });

    test('GET should respond with 404 if id is not found', () => {
      return superagent.get(`${apiURL}/1234`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });

  // ===================== PUT =====================
  describe('PUT /api/dogs/:id', () => {
    test('PUT should respond with 200 and data if no error and data should be updated', () => {
      let dogToPut = null;

      return dogMockCreate()
        .then(dog => {
          dogToPut = dog;
          return superagent.put(`${apiURL}/${dog._id}`)
            .send({name: 'El Capitain'});
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body.name).toEqual('El Capitain');
          expect(response.body.legs).toEqual(dogToPut.legs);
          expect(response.body._id).toEqual(dogToPut._id.toString());
          expect(response.body.timestamp).not.toBeNull();
        });
    });

    test('PUT should respond with 404 if id is not found', () => {
      return superagent.put(`${apiURL}/1234`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });

  // ===================== DELETE =====================
  describe('DELETE /api/dogs/:id', () => {
    test('DELETE should respond with 204 and data if no error', () => {

      return dogMockCreate()
        .then(dog => {
          return superagent.delete(`${apiURL}/${dog._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE should respond with 404 if id is not found', () => {
      return superagent.delete(`${apiURL}/1234`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });
});