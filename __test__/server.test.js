'use strict';



process.env.PORT = 3424;
process.env.MONGODB_URI = `mongodb://localhost:27017/plants`;

const faker = require('faker');
const superagent = require('superagent');
const Plant = require(`../model/plant`);
const server = require(`../lib/server`);

const apiURL = `http://localhost:${process.env.PORT}/api/notes`;

const plantItemMockCreate = () => {
  return new Plant ({
    scientificName: faker.lorem.words(3),
    commonName: faker.lorem.words(2),
    floraType: faker.lorem.words(1),
  }).save();
};

describe('/api/notes', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Plant.remove({}));

  describe('POST /api/plants', () => {

    test(`Should respond with a 'Plant' object and a 200 status code`, () => {
      let testPlantItem = {
        scientificName: faker.lorem.words(3),
        commonName: faker.lorem.words(2),
        floraType: faker.lorem.words(1),
      };
      return superagent.post(`${apiURL}`)
        .send(testPlantItem)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(typeof response.body.entryDate).toEqual('Date');
          expect(typeof response.body.scientificName).toEqual('String');
          expect(typeof response.body.commonNames).toEqual('Array');
          expect(typeof response.body.floraType).toEqual('String');
        });
    });

    test(`Should respond with a 400 status code`, () => {
      let testPlantItem = {
        //empty item - ultiple required field not satisfied - will fail.
      };
      return superagent.post(`${apiURL}`)
        .send(testPlantItem)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /api/plants/:id', () => {
    test('Should respond with a 200 status code', () => {

      let plantTestItem = null;

      plantItemMockCreate()
        .then(plant => {
          plantTestItem = plant;
          return superagent.get(`${apiURL}/${plant._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(typeof response.body.entryDate).toEqual('Date');
          expect(typeof response.body.scientificName).toEqual(plantTestItem.scientificName);
          expect(typeof response.body.commonNames).toEqual(plantTestItem.commonNames);
          expect(typeof response.body.floraType).toEqual(plantTestItem.floraType);
        });

    });
    test('Should respond with a 404 status code', () => {
      return superagent.get(`${apiURL}/XXXXXXXXXXXX`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

});
