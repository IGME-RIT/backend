var mongoose = require('mongoose');

function Author(name, email, github) {
  this.name = name || 'Unknown author';
  this.email = email || 'bad@email.com';
  this.github = github || 'Unknown GitHub name';
}

Author.schema = function() {
  return new mongoose.Schema({
    name: String,
    email: String,
    github: String
  });
};

module.exports = Author;
