module.exports = function(enumerable) {
  enumerable.forEach = function(cb) {
    var index = 0;
    for (var key in enumerable) {
      if (enumerable.hasOwnProperty(key)) {
        if (cb(key, enumerable[key], index))
          return;
        index++;
      }
    }
  };
  enumerable.keyForVal = function (value) {
    var instance = undefined;
    enumerable.forEach(function (key, val) {
      if (value === val) {
        instance = key;
        return true;
      }
    });
    if (instance) 
      return instance;
  };
  return Object.freeze(enumerable);
};
