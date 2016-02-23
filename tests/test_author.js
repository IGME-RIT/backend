var expect = require('chai').expect;

var Author = require('../app/models/author.js').Author;

describe('Author', function () {
  context('#constructor', function () {
    it('should set default property values with no arguments', function () {
      var author = new Author({});
      expect(author).to.have.deep.property('name', 'Unknown author');
      expect(author).to.have.deep.property('email', 'bad@email.com');
      expect(author).to.have.deep.property('github', 'Unknown GitHub name');
    });
    it('should set the right properties when passed as arguments', function () {
      var author = new Author({name:'Aaron Sky', email:'aaronsky@skyaaron.com', github:'aaronsky'});
      expect(author).to.have.deep.property('name', 'Aaron Sky');
      expect(author).to.have.deep.property('email', 'aaronsky@skyaaron.com');
      expect(author).to.have.deep.property('github', 'aaronsky');
    });
  });
});