// This file definse a mongoose Schema for images, which used to be a part of igme_config.yml
// However, we realized that we could just hard-code accessing igme_thumbnail.png as part of the repo,
// so this file is now obsolete.

var mongoose = require('mongoose');

var ImageSetSchema = new mongoose.Schema({
  icon: {type: String, default: ''},
  banner: {type: String, default: ''}
});

var ImageSet = mongoose.model('ImageSet', ImageSetSchema);

ImageSetSchema.pre('save', function (next) {
    var that = this;
    ImageSet.find({ icon: that.icon, banner: that.banner }, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('ImageSet exists: ', that.name);
            next(new Error("ImageSet exists!"));
        }
    });
});

module.exports = {
  ImageSet: ImageSet,
  Schema: ImageSetSchema
};
