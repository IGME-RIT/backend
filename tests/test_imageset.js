var expect = require('chai').expect;

var ImageSet = require('../app/models/imageset.js');

describe('ImageSet', function () {
  context('#constructor', function () {
    it('should set properties to empty strings by default', function () {
      var imageset = new ImageSet();
      expect(imageset).to.have.deep.property('icon', '');
      expect(imageset).to.have.deep.property('banner', '');
    });
    it('should set the right properties when passed as arguments', function () {
      var imageset = new ImageSet('https://google.com/', 'https://google.com/');
      expect(imageset).to.have.deep.property('icon', 'https://google.com/');
      expect(imageset).to.have.deep.property('banner', 'https://google.com/');
    });
  });
});