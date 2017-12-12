'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = `mongodb://localhost/testing`;

const faker = require(`faker`);
const superagent = require(`superagent`);
const Sweet = require(`../model/sweet`);
const server = require(`../lib/server`);

const apiURL = `http://localhost:${process.env.PORT}/api/sweets`;

let createFakeSweet = () => {
  return new Sweet({
    name: faker.lorem.words(3),
    hasChocolate: true,
    temperature: faker.lorem.words(1),
    seasonal: false,
  }).save();
};

describe(`/api/sweets`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Sweet.remove({}));

  describe(`POST request`, () => {
    let fakeSweet = {
      name: faker.lorem.words(3),
      hasChocolate: true,
      temperature: faker.lorem.words(1),
      seasonal: false,
    };
    test(`POST should respond with a 200 status if successful`, () => {
      return superagent.post(`${apiURL}`)
        .send(fakeSweet)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(fakeSweet.name);
          expect(response.body.hasChocolate).toEqual(true);
          expect(response.body.temperature).toEqual(fakeSweet.temperature);
          expect(response.body.seasonal).toEqual(false);
        })
        .catch(error => {
          console.log(`Oh Noes! There was an error: ${error}`);
        });
    });
    test(`POST should respond with 400 status if the body is missing information`, () => {
      return superagent.post(`${apiURL}`)
        .send({
          name: faker.lorem.word(2),
          hasChocolate: false,
          seasonal: true,
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
  describe(`GET request`, () => {
    test.only(`GET should respond with a 200 status if a sweet with the specified id is found`, () => {
      let testSweet = null;

      createFakeSweet()
        .then(sweet => {
          testSweet = sweet;
          return superagent.get(`${apiURL}/${sweet._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        })
        .catch(error => {
          console.log(error);
          console.log(`Oh Noes! There was an error: ${error}`);
        });
    });

    test(`GET should respond with a 404 status if NO sweet with the specified id is found`, () => {
      return superagent.get(`${apiURL}/blah`)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.status);
          expect(response.status).toEqual(404);
        });
    });
  });
});
