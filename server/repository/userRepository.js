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
            callback(null, true);
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
    User.findOne({username: username}).lean().exec(function(err, user) {
        if(err) console.log(err);
        cb(user);
    });
};

exports.findUserById = function(id, cb) {
    User.findOne({_id: id}).lean().exec(function(err, user) {
        if(err) console.log(err);
        cb(user);
    });
};

exports.findOneAndUpdate = function(id, update, cb) {
    User.findOneAndUpdate({ _id : id}, {firstname: update.firstname, lastname : update.lastname},{new : true}, function(err, user) {
        if(err) console.log(err);
        cb(user);
    });
};

exports.getUsers = function(cb) {
    User.find().lean().exec(function (err, users) {
        if(err) console.log(err);
        cb(users);
    })
};
