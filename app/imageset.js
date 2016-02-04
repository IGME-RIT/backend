ImageSet = (function() {
  function ImageSet(icon, banner) {
    this.icon = icon || '';
    this.banner = banner || '';
  }

  return ImageSet;
})();

module.exports = ImageSet;