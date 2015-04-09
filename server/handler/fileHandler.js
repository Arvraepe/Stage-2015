/**
 * Created by Glenn on 7-4-2015.
 */
var fs = require('fs');

exports.createFile = function(file, name, callback) {
    fs.readFile(file.path, function (err, data) {
        /// If there's an error
        if(!name){
            callback(err);
        } else {
            var ext = file.name.split('.')[1];
            var newPath = "./uploads/" + name + '.jpg';

            /// write file to uploads folder
            fs.writeFile(newPath, data, function (err) {
                if(err)callback(err);
                callback(null, '.'+ext);
            });
        }
    });
};

exports.getImage = function(username, ext, callback) {
    fs.readFile('../server/uploads/' + username + ext, function (err, data) {
        if (err) callback(err);
        ext = ext.replace('.', '');
        callback(null, data.toString('base64'), ext);
    });
};
