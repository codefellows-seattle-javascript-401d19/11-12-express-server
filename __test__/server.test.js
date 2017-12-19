'use strict';


require('dotenv').config();
console.log(process.env.PORT = 3000);
console.log(process.env.MONGODB_URI = `mongodb://localhost:27017/plants`);

const faker = require('faker');
const superagent = require('superagent');
const Plant = require(`../model/plant`);
const server = require(`../lib/server`);

const apiURL = `http://localhost:${process.env.PORT}/api/plants`;

const plantItemMockCreate = () => {
  return new Plant ({
    scientificName: faker.lorem.words(3),
    commonName: faker.lorem.words(2),
    floraType: faker.lorem.words(1),
  }).save();
};

describe('[ TEST SET for : /api/plants ]', () => {
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
      console.log(`APIRUL: ${apiURL}`);
      console.log(`TESTPLANTITEM: ${JSON.stringify(testPlantItem)}`);
      return superagent.post(`${apiURL}`)
        .send(testPlantItem)
        .then(response => {
          console.log(`RESPONSE ${response.status}`);
          expect(response.status).toBe(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.entryDate).toBeTruthy();
          expect(typeof response.body.scientificName).toEqual('string');
          expect(typeof response.body.commonName).toEqual('string');
          expect(typeof response.body.floraType).toEqual('string');
        })
        .catch(error => {
          console.log(`Failed POST, status: ${error.status}`);
          console.log(`Failed POST, message: ${error.message}`);
        });
    });

    test(`Should respond with a 400 status code`, () => {
      let testPlantItem = {
        //Phelan - empty item - multiple required fields not satisfied - will fail, as intended.
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
          expect(response.body.entryDate).toBeTruthy();
          expect(response.body.scientificName).toEqual(plantTestItem.scientificName);
          expect(response.body.commonNames).toEqual(plantTestItem.commonNames);
          expect(response.body.floraType).toEqual(plantTestItem.floraType);
        });

    });
    test('Should respond with a 404 status code', () => {
      return superagent.get(`${apiURL}/thIsIsAFAkeIDFO0l`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

});
