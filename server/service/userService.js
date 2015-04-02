/**
 * Created by Glenn on 2-4-2015.
 */
var md5 = require('./../encryption/md5');
var salt = require('./../encryption/salt');
var userRepo = require('./../repository/userRepository');
var resultFactory = require('./../factory/resultFactory');

//userverifier

exports.registerUser = function (user, callback) {
    //todo verify data from user
    userRepo.userExists(user.username, function (exists) {
        if (exists) {
            callback(resultFactory.makeResult(false, 'error', 'Username already exists.', {}));
        } else {
            var saltStr = salt.getSalt(user.password, ''); //empty string because the function will build the salt from scratch
            user.password = md5.md5(user.password + saltStr);
            user.salt = saltStr;
            userRepo.registerUser(user, function (err, registeredUser) {
                if (err) {
                    callback(resultFactory.makeResult(false, 'error', 'Unexpected error while saving user credentials.', []))
                } else {
                    var userResult = resultFactory.makeUserResult(registeredUser);
                    callback(resultFactory.makeResult(true, 'info', 'User registered successfully', userResult));
                }
            });
        }
    });
};

exports.loginUser = function (credentials, callback) {
    userRepo.findUser(credentials.username, function(user) {
        if (user == null) {
            callback(wrongLogin());
        } else {
            var encryptedPassword = md5.md5(credentials.password + user.salt);
            if (encryptedPassword === user.password) {
                var userResult = resultFactory.makeUserLoginResult(user);
                callback(resultFactory.makeResult(true, 'info', 'User logged in successfully.', userResult));
            } else {
                console.log('incorrect password');
                callback(wrongLogin());
            }
        }
    });

};

function wrongLogin() {
    return resultFactory.makeResult(false, 'error', 'Username or password are incorrect.', []);
}