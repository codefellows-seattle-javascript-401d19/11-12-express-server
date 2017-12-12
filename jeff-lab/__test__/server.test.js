'use strict';

const faker = require('faker');
const superagent = require('superagent');
const Team = require('../model/team');
const server = require('../lib/server');
const logger = require('../lib/logger');

const apiURL = `http://localhost:${process.env.PORT}/api/teams`;

const teamMockCreate = () => {
  return new Team({
    sport: faker.lorem.words(1),
    city: faker.lorem.words(1),
    nickname: faker.lorem.words(2),
  }).save();
};


describe('/api/teams', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(() => Team.remove({}));


  describe('POST /api/teams', () => {
    test('should respond with a team and 200 status code if there is no error', () => {
      let teamToPost = {
        sport: faker.lorem.words(1),
        city: faker.lorem.words(1),
        nickname: faker.lorem.words(2),
      };
      return superagent.post(`${apiURL}`)
        .send(teamToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.sport).toEqual(teamToPost.sport);
          expect(response.body.city).toEqual(teamToPost.city);
          expect(response.body.nickname).toEqual(teamToPost.nickname);
        });
    });
    test('should respond with a 400 code if we send an incomplete team', () => {
      let teamToPost = {
        sport: faker.lorem.words(1),
      };
      return superagent.post(`${apiURL}`)
        .send(teamToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/teams/:id', () => {
    test('should respond with 200 status code if there is no error', () => {
      let teamToTest = null;

      return teamMockCreate()
        .then(team => {
          teamToTest = team;
          return superagent.get(`${apiURL}/${team._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(teamToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.sport).toEqual(teamToTest.sport);
          expect(response.body.city).toEqual(teamToTest.city);
          expect(response.body.nickname).toEqual(teamToTest.nickname);
        });
    });
    test('should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/Dewey`)
        // .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

  });
  describe('GET /api/teams', () => {
    test('Should return array of objects of all teams and status 200', () => {

      return teamMockCreate()
        .then( () => {
          return superagent.get(`${apiURL}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(1);
        });
    });
  });
  describe('DELETE /api/teams/:id', () => {
    test('should respond with 204 status code if there is no error', () => {

      return teamMockCreate()
        .then(team => {
          return superagent.delete(`${apiURL}/${team._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 400 if no id is sent', () => {
      return superagent.delete(`${apiURL}`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test('should respond with 404 if invalid id is sent', () => {
      return superagent.delete(`${apiURL}/Dewey`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

  });
});
