//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.JWT_KEY = "secret";

//Require the dev-dependencies
const mongoose = require("mongoose");
const User = require('../api/models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

mongoose.set('useCreateIndex', true);
chai.use(chaiHttp);

const register_details = {
  'email': 'email@email.com',
  'password': '123@abc'
};

const login_details = {
  'email': 'email@email.com',
  'password': '123@abc'
};

describe('Create Account, Login and Check Token', () => {
  beforeEach((done) => {
    // Delete user account before each test
    User.deleteMany({}, (err) => {
      console.log(err);
      done();
    })
  });

  describe('/POST Signup', () => {
    it('it should signup, login, and check token', (done) => {
      chai.request(server)
        .post('/user/signup')
        .send(register_details)
        .end((err, res) => { // when we get a response from the endpoint

          // the res object should have a status of 201
          res.should.have.status(201);

          chai.request(server)
            .post('/user/login')
            .send(login_details)
            .end((err, res) => {
              console.log('this was run the login part');
              res.should.have.status(200);
              //chai.expect(res.body.state).to.be.true;
              res.body.should.have.property('token');

              const data = JSON.parse(res.text);

              chai.request(server)
                .post('/checkjwt')
                .set('Authorization', 'Bearer ' + data['token'])
                .end((err, res) => {
                  console.log('checking if valid token...');
                  res.should.have.status(201);
                  console.log('Valid!!!');

                  done();
                });

            });

        });
    });
  });

});