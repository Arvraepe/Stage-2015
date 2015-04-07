/**
 * Created by Glenn on 7-4-2015.
 */
var fs = require('fs');

exports.createFile = function(file, name) {
    fs.readFile(file.path, function (err, data) {

        /// If there's an error
        if(!name){

            console.log("There was an error");
            res.redirect("/");
            res.end();

        } else {
            var newPath = "./uploads/" + name + '.jpg';

            /// write file to uploads/fullsize folder
            fs.writeFile(newPath, data, function (err) {
                if(err)console.log(err);
                /// let's see it

            });
        }
    });
};
