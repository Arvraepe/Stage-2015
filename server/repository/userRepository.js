/**
 * Created by Glenn on 31-3-2015.
 */
var mongoose = require('mongoose');
var md5 = require('./../encryption/md5')
mongoose.connect('mongodb://localhost/AgCollab');

var db = mongoose.connection;
db.on('error', function(err) {
});
var userSchema = mongoose.Schema({
    username : String,
    password : String,
    email : String,
    firstname : String,
    lastname : String
});
var User = mongoose.model('User', userSchema);

exports.registerUser = function (username, password, email, firstname, lastname, callback) {
    var result;
    password = md5.md5(password);
    userExists(username, function (exists) {
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
                password: password, //todo: encrypt
                email: email,
                firstname: firstname,
                lastname: lastname
            });
            registeredUser.save(function (err, user) {

                if (err) {
                    result =
                    {
                        'success': false,
                        'messages':
                        {
                            'level': 'error',
                            'message': 'Unexpected error while saving user credentials.'
                        }
                    };
                    callback(result);
                } else {
                    result =
                    {
                        'success': true,
                        'data':
                        {
                            'user':
                            {
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
}

function userExists(username, callback) {
    User.find({username : username}, function(err, users) {
        if(err) console.log(error); //todo log

        callback(users.length >= 1);
    });
}
