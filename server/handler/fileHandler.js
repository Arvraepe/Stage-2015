/**
 * Created by Glenn on 7-4-2015.
 */
var fs = require('fs');
var config = require('./../config.json');
var _ = require('underscore');

exports.createFile = function(file, name, callback) {
    fs.readFile(file.path, function (err, data) {
        /// If there's an error
        if(!name){
            callback(err);
        } else {
            var ext = file.name.split('.')[1];
            if(_.contains(config.supportedImages, ext)) {
                var newPath = config.imagePath + name + '.' + ext;

                /// write file to uploads folder
                fs.writeFile(newPath, data, function (err) {
                    if (err)callback(err);
                    callback(null, '.' + ext);
                });
            } else {
                callback(new Error('File type was not supported.'));
            }
        }
    });
};

exports.deleteFile = function(user, callback) {
    var imageUrl = user.imageUrl.split("/");
    var filename = imageUrl[imageUrl.length-1];
    fs.unlink(config.imagePath + filename, callback);
};
