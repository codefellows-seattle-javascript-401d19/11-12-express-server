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
  afterEach(() => Bike.remove({}));

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
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });
});