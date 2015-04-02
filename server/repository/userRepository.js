/**
 * Created by Glenn on 31-3-2015.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AgCollab');

var db = mongoose.connection;
db.on('error', function (err) {
});
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    salt: String,
    firstname: String,
    lastname: String
});
var User = mongoose.model('User', userSchema);

exports.registerUser = function (user, callback) {
    var registeredUser = new User({
        username: user.username,
        password: user.password,
        salt: user.salt,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
    });
    registeredUser.save(function (err, registeredUser) {
        if (err) {
            callback(err);
        } else {
            callback(null, registeredUser);
        }
    });
};

exports.userExists = function (username, cb) {
    User.find({username: username}, function (err, users) {
        if (err) console.log(err); //todo log
        cb(users.length >= 1);
    });
};

exports.findUser = function(username, cb) {
    User.findOne({username: username}, function(err, user) {
        if(err) console.log(err);
        cb(user);
    });
};
