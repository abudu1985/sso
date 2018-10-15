//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

mongoose.set('useCreateIndex', true);
chai.use(chaiHttp);


  /*
   * Test the /GET route
   */
  describe('/GET product', () => {
    it('it should GET all the products', (done) => {
      chai.request(server)
        .get('/products')
        .end((err, res) => {
        if(err){
          console.log(err);
          res.status(500).json({error: err});
        }
          res.should.have.status(200);

          const data = JSON.parse(res.text);
          chai.expect(res.text).to.be.a('string');
          chai.expect(data).to.have.property('count');
          chai.expect(data).to.have.property('products');
          done();
        });
    });
  });