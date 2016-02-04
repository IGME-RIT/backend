Author = (function() {
  function Author(name, email, github) {
    this.name = name || 'Unknown author';
    this.email = email || 'bad@email.com';
    this.github = github || 'https://github.com/';
  }

  return Author;
})();

module.exports = Author;