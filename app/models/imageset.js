var mongoose = require('mongoose');

function ImageSet(icon, banner) {
  this.icon = icon || '';
  this.banner = banner || '';
}
ImageSet.schema = function() {
  return new mongoose.Schema({
    icon: String,
    banner: String
  });
};

module.exports = ImageSet;
