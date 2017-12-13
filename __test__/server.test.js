'use strict';

process.env.PORT = 3000;

process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Wizard = require('../model/wizard');
const server = require('../lib/server');
const logger = require('../lib/logger');

const apiURL = `http://localhost:${process.env.PORT}/api/wizards`;

const wizardMockCreate = () => {
  return new Wizard({
    title : faker.lorem.words(10),
    content : faker.lorem.words(100),
  }).save();
};

describe('/api/wizards', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Wizard.remove({}));

  describe('POST /api/wizards', () => {
    test('should respond with a wizard and 200 status code if there are no errors', () => {
      let wizardToPost = {
        title : faker.lorem.words(10),
        content : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(wizardToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.title).toEqual(wizardToPost.title);
          expect(response.body.content).toEqual(wizardToPost.content);          
        })
        .catch(error => logger.log('error', error));
    });

    test('should respond with a 400 code if we send an incomplete wizard', () => {
      let wizardToPost = {
        content : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(wizardToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/wizards', () => {
    test('GET should respond with 200 status code if there is a valid wizard id and no errors', () => {
      let wizardToTest = null;

      return wizardMockCreate()
        .then(wizard => {
          wizardToTest = wizard;
          return superagent.get(`${apiURL}/${wizard._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(wizardToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.title).toEqual(wizardToTest.title);
          expect(response.body.content).toEqual(wizardToTest.content);          
        });    
    });

    test('GET should respond with an array of all wizard objects if get request is made with out an id', () => {
      return wizardMockCreate()
        .then(() => wizardMockCreate())
        .then(() => wizardMockCreate())
        .then(() => superagent.get(`${apiURL}`))
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(3);
        });
    });
    
    test('GET should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/mooshy`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/wizards/:id', () => {
    test('DELETE should respond with 204 status code with no content in the body if successfully deleted', () => {
      return wizardMockCreate()
        .then(wizard => {
          return superagent.delete(`${apiURL}/${wizard._id}`)
            .then(response => {
              expect(response.status).toEqual(204);
            });
        });
    });
  
    test('DELETE should respond with 404 status code if id is invalid', () => {
      return superagent.delete(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('DELETE should respond with 400 status code if no id is provided', () => {
      return superagent.del(`${apiURL}`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('PUT /api/wizards/:id', () => {
    test('should update wizard and respond with 200 if there are no errors', () => {
      
      let wizardToUpdate = null;
      
      return wizardMockCreate()
        .then(wizard => {
          wizardToUpdate = wizard;
          return superagent.put(`${apiURL}/${wizard._id}`)
            .send({title: 'Dalton Carr'});
        }).then(response => { 
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Dalton Carr');
          expect(response.body.content).toEqual(wizardToUpdate.content);
          expect(response.body._id).toEqual(wizardToUpdate._id.toString()); 
        });
    });
    
    test('should return a 400 status code if invalid PUT request', () => {
      return wizardMockCreate()
        .then(wizard => superagent.put(`${apiURL}/${wizard._id}`))
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });
});