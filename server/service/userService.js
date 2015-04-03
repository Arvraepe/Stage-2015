/**
 * Created by Glenn on 2-4-2015.
 */
var md5 = require('./../encryption/md5');
var salt = require('./../encryption/salt');
var userRepo = require('./../repository/userRepository');
var resultFactory = require('./../factory/resultFactory');
var authService = require('./authenticationService');

//userverifier

exports.registerUser = function (user, callback) {
    //todo verify data from user
    userRepo.userExists(user.username, function (exists) {
        if (exists) {
            callback(resultFactory.makeResult(makeConfigNoData(false, 'error', 'Username already exists.')));
        } else {
            var saltStr = salt.getSalt(user.password, ''); //empty string because the function will build the salt from scratch
            user.password = md5.md5(user.password + saltStr);
            user.salt = saltStr;
            userRepo.registerUser(user, function (err, success) {
                if (err) {
                    callback(resultFactory.makeResult(makeConfigNoData(false, 'error', 'Unexpected error while saving credentials')));
                } else {
                    callback(resultFactory.makeResult(makeConfigNoData(success, 'info', 'User registered successfully')));
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
                userResult.token = authService.issueToken(user._id);
                var conf = makeConfig(true, 'info', 'User logged in successfully.', userResult);
                callback(resultFactory.makeResult(conf));
            } else {
                callback(wrongLogin());
            }
        }
    });
};

exports.getAllUsers = function(callback) {
    userRepo.getUsers(function(users) {
        var conf = makeConfig(true, 'info', users.length + ' users fetched', resultFactory.makeUserResult(users));
        callback(conf);
    });
};

exports.updateUser = function(params, calback) {
    authService.verifyToken(params.token, function(err, decoded) {
        if(err) console.log(err);
        userRepo.findOneAndUpdate(decoded, params, function(user) {
            var userResult = resultFactory.makeUserResult(user);
            console.log(userResult);
            var conf = makeConfig(true, 'info', 'user modified successfully', userResult);
            console.log(conf);
            calback(conf);
        })
    })
};

function wrongLogin() {
    return resultFactory.makeResult(makeConfigNoData(false, 'error', 'Username or password are incorrect.'));
}

function makeConfigNoData (success, code, message) {
    return { 'success': success, 'messages' : { 'code' : code, 'message' : message } };
}

function makeConfig(success, code, message, data) {
    var temp = makeConfigNoData(success, code, message);
    temp.data = data;
    return temp;
}