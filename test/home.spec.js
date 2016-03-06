var chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    app = require('../app'),
    twilio = require('../app/controllers/home.js');

chai.use(chaiHttp);
// var call = chai.request(app);

describe('test-setup', function(){
  it('should work', function(){
    expect(true).to.be.true;
  });
});

describe('routes', function(){
  it('/', function(done){
    chai.request(app)
      .get('/')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done();
      });
  });

  // it('POST /sendSMS', function(done){
  //   chai.request(app)
  //     .post('/sendSMS')
  //     // .field('_method', 'PUT')
  //     // .field('phone', '+16155161416')
  //     // .field('message', 'hello, from the tests!')
  //     .send({phone: '+16155161416', message: 'hello, from the tests!'})
  //     .end(function(err, res){
  //       console.log('tests', res);
  //       done();
  //     });
  // });
});
