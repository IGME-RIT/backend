var mongoose = require("mongoose");

var uriStr = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/HelloMongoose';

mongoose.connect(uriStr, function (err, res) {
  if (err) { 
    console.error ('ERROR connecting to: ' + uriStr + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uriStr);
  }
});

