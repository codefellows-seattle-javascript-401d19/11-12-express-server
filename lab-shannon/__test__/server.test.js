'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = `mongodb://localhost/testing`;

const faker = require(`faker`);
const superagent = require(`superagent`);
const Sweet = require(`../model/sweet`);
const server = require(`../lib/server`);

const apiURL = `http://localhost:${process.env.PORT}/api/sweets`;

describe(`/api/sweets`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Sweet.remove({}));

  describe(`POST request`, () => {
    let fakeSweet = {
      name: faker.lorem.words(3),
      hasChocolate: true,
      temperature: cold,
      seasonal: false,
    }
    test(`POST request should response with a 200 status if successful`, () => {
      return superagent.post(`${apiURL}`)
        .send(fakeSweet)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(fakeSweet.name);
          expect(response.body.hasChocolate).toEqual(true);
          expect(response.body.temperature).toEqual(cold);
          expect(response.body.seasonal).toEqual(false);
        })
    })
  })
})
