'use strict';

require('dotenv').config();
const superagent = require('superagent');
const Bike = require('../model/bike');
const server = require('../lib/server');
const __API_URL__ = `http://localhost:${process.env.PORT}/api/bikes`;

const createBike = () => {
  return new Bike({
    make: 'Buell',
    model: 'XB12s',
    year: 2004,
    displacement: 1203,
  }).save();
};

describe('/api/bikes', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(() => Bike.remove({}));

  describe('POST /api/bikes', () => {
    test('should respond with a bike and 200 status code if there is no error.', () => {
      let bikeToPost = {
        make: 'Buell',
        model: 'XB12s',
        year: 2004,
        displacement: 1203,
      };

      return superagent.post(__API_URL__)
        .send(bikeToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
          expect(response.body.make).toEqual('Buell');
          expect(response.body.model).toEqual('XB12s');
          expect(response.body.year).toEqual(2004);
          expect(response.body.displacement).toEqual(1203);
        });
    });

    test('should respond with a 400 status code if incomplete data is sent.', () => {
      let incompleteBike = {
        make: 'Suzuki',
        model: 'GS500f',
      };

      return superagent.post(__API_URL__)
        .send(incompleteBike)
        .then(Promise.reject)
        .catch(response => expect(response.status).toEqual(400));
    });
  });
  
  describe('GET /api/bikes with an id', () => {
    test('should respond with a specific bike and 200 status code if there is no error.', () => {
      return createBike()
        .then(bike => {
          return superagent.get(`${__API_URL__}/${bike._id}`)
            .then(response => {
              expect(response.status).toEqual(2001);
              expect(response.body._id).toEqual(bike._id.toString());
              expect(response.body.timestamp).toBeTruthy();
              expect(response.body.make).toEqual(bike.make);
              expect(response.body.model).toEqual(bike.model);
              expect(response.body.year).toEqual(bike.year);
              expect(response.body.displacement).toEqual(bike.displacement);
            });
        });
    });

    test('should respond with a 404 status code if no bike with the given id exists.', () => {
      return superagent.get(`${__API_URL__}/french-fries`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('GET /api/bikes without an id', () => {
    test('should respond with an array of all bikes and 200 status code if there is no error.', () => {
      return createBike()
        .then(() => {
          return superagent.get(`${__API_URL__}`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(Array.isArray(response.body)).toBeTruthy();
              expect(response.body.length).toBeGreaterThanOrEqual(1);
            });
        });
    });
  });

  describe('DELETE /api/bikes with an id', () => {
    test('should respond with a 204 status code if there is no error.', () => {
      return createBike()
        .then(bike => {
          return superagent.delete(`${__API_URL__}/${bike.id}`)
            .then(response => {
              expect(response.status).toEqual(204);
            });
        });
    });

    test('should respond with a 404 status code if the id is of bad form.', () => {
      return superagent.delete(`${__API_URL__}/uh-oh`)
        .then(Promise.reject)
        .catch(response => expect(response.status).toEqual(404));
    });
    
    test('should respond with a 404 status code if the id is not found.', () => {
      return superagent.delete(`${__API_URL__}/12345`)
        .then(Promise.reject)
        .catch(response => expect(response.status).toEqual(404));
    });
    
    test('should respond with a 400 status code if no id is provided.', () => {
      return superagent.delete(`${__API_URL__}`)
        .then(Promise.reject)
        .catch(response => expect(response.status).toEqual(400));
    });
  });

  describe('PUT /api/bikes/:id', () => {
    test('should respond with a 200 status code and the updated bike.', () => {
      return createBike()
        .then(bike => {
          return superagent.put(`${__API_URL__}/${bike._id}`)
            .send({make: 'test make'})
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.make).toEqual('test make');
              expect(response.body.model).toEqual('XB12s');
              expect(response.body.year).toEqual(2004);
              expect(response.body.displacement).toEqual(1203);
            });
        });
    });

    test('should respond with a 400 status code if no relevant properties are sent.', () => {
      return createBike()
        .then(bike => {
          return superagent.put(`${__API_URL__}/${bike._id}`)
            .send({barnacles: 'test make'})
            .then(Promise.reject)
            .catch(response => expect(response.status).toEqual(400));
        });
    });
    
    test('should respond with a 404 status code requested id not found.', () => {
      return createBike()
        .then(() => {
          return superagent.put(`${__API_URL__}/1012`)
            .send({ make: 'honda'})
            .then(Promise.reject)
            .catch(response => expect(response.status).toEqual(404));
        });
    });
  });
});