/**
 * Created by Glenn on 31-3-2015.
 */
var mongoose = require('mongoose');
var md5 = require('./../encryption/md5');
var salt = require('./../encryption/salt');
var userFactory = require('./../factory/userFactory');
var resultfactory = require('./../factory/resultFactory');
mongoose.connect('mongodb://localhost/AgCollab');

var db = mongoose.connection;
db.on('error', function(err) {
});
var userSchema = mongoose.Schema({
    username : String,
    password : String,
    email : String,
    salt: String,
    firstname : String,
    lastname : String
});
var User = mongoose.model('User', userSchema);

exports.registerUser = function (username, password, email, firstname, lastname, callback) {
    userExists(username, function (exists) { //todo add email verification (needs to be unique)
        salt.getSalt(password, '', function(salt) { //empty string because the function will build the salt from scratch
            md5.md5(password + salt, function (encryptedPassword) {
                if (exists) {
                    resultfactory.makeResult(false, 'error', 'Username already exists.', [],  function(result) {
                        callback(result);
                    });
                } else {
                    var registeredUser = new User({
                        username: username,
                        password: encryptedPassword,
                        salt: salt,
                        email: email,
                        firstname: firstname,
                        lastname: lastname
                    });
                    registeredUser.save(function (err, user) {
                        if (err) {
                            resultfactory.makeResult(false, 'error', 'Unexpected error while saving user credentials.', [],  function(result) {
                                callback(result);
                            });
                        } else {
                            userFactory.makeUserResult(user.username, user.email, user._id, user.firstname, user.lastname, function (userResult) {
                                resultfactory.makeResultNoMessage(true, userResult, function(result) {
                                    callback(result);
                                })
                            });
                        }
                    });
                }
            });
        });
    });
};

exports.loginUser = function (username, password, callback) {
    User.findOne({ username: username}, function(err, user) {
        if(err) console.log(err);
        if(user == null) {
            wrongLogin(callback);
        } else {
            md5.md5(password + user.salt, function (encryptedPW) {
                if (encryptedPW === user.password) {
                    userFactory.makeUserLoginResult(user.username, user.email, user._id, user.firstname, user.lastname, function (useResult) {
                        resultfactory.makeResult(true, 'info', 'User logged in successfully.', useResult, function (result) {
                            callback(result);
                        });
                    });
                } else {
                    wrongLogin(callback);
                }
            });
        }
    });
};

function userExists(username, callback) {
    User.find({username : username}, function(err, users) {
        if(err) console.log(error); //todo log

        callback(users.length >= 1);
    });
}

function wrongLogin(callback) {
    resultfactory.makeResult(false, 'error', 'Username or password are incorrect.', [], function(result) {
        callback(result);
    });
}
