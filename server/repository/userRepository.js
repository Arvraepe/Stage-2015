/**
 * Created by Glenn on 31-3-2015.
 */
var mongoose = require('mongoose');
var md5 = require('./../encryption/md5');
var salt = require('./../encryption/salt');
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
    var result;
    userExists(username, function (exists) { //todo add email verification (needs to be unique)
        salt.getSalt(password, '', function(salt) { //empty string because the function will build the salt from scratch
            md5.md5(password + salt, function (encryptedPassword) {
                if (exists) {
                    result = {
                        'success': false,
                        'messages': {
                            'level': 'error',
                            'message': 'Username already exists.'
                        }
                    };
                    callback(result);
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
                            result =
                            {
                                'success': false,
                                'messages': {
                                    'level': 'error',
                                    'message': 'Unexpected error while saving user credentials.'
                                }
                            };
                            callback(result);
                        } else {
                            result =
                            {
                                'success': true,
                                'data': {
                                    'user': {
                                        'username': user.username,
                                        'email': user.email,
                                        '_id': user._id,
                                        'firstname': user.firstname,
                                        'lastname': user.lastname
                                    }
                                }
                            };
                            callback(result);
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
        md5.md5(password + salt, function (encryptedPW) {
            console.log(encryptedPW + '      ' + user.password);
            if(encryptedPW === user.password) {
                callback(user);
            }
        });
    });
};

function userExists(username, callback) {
    User.find({username : username}, function(err, users) {
        if(err) console.log(error); //todo log

        callback(users.length >= 1);
    });
}
