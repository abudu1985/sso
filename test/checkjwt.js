//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.JWT_KEY = "secret";

//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

mongoose.set('useCreateIndex', true);
chai.use(chaiHttp);

const faik_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFp' +
                   'bCI6ImFAdWtyLm5ldCIsInVzZXJJZCI6IjVi' +
                   'YzIzODgzMzcxN2JmNjA4MGJlNjU2MSIs' +
                   'ImlhdCI6MTUzOTQ2MDU2NSwiZXhwIjoxN' +
                   'TM5NDYwNjI1fQ.ZDL-nK2IJsCSShM7wr7' +
                   'wWwX840h_Hu1T4QgeOqD3IoY';

describe('/POST Fake jwt', () => {
  it('it should caught fake token', (done) => {
    chai.request(server)
      .post('/checkjwt')
      .set('Authorization', faik_token)
      .end((err, res) => {
        console.log('checking if valid token...');
        res.should.have.status(500);
        console.log('Fail!!!');

        done();
      });
  });

});