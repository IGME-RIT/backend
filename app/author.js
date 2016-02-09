var Author = (function() {
  function Author(name, email, github) {
    this.name = name || 'Unknown author';
    this.email = email || 'bad@email.com';
    this.github = github || 'Unknown GitHub name';
  }

  return Author;
})();

module.exports = Author;