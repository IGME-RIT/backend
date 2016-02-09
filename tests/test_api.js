var request = require('supertest');

var db_fake = [{

}];

describe('api', function() {
  var server;

  beforeEach(function() {
    server = require('../app/api.js')(db_fake);
  });

  context('#get /', function() {
    it('responds to /', function(done) {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });
  context('#get /repos', function() {
    
  });
  context('#get /repos/:id', function() {

  });
  context('invalid routes', function() {
    it('should 404', function(done) {
      request(server)
        .get('/foo/bar')
        .expect(404, done);
    });
  });
});
