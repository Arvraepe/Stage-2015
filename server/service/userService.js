/**
 * Created by Glenn on 2-4-2015.
 */
var md5 = require('./../encryption/md5');
var salt = require('./../encryption/salt');
var userRepo = require('./../repository/userRepository');
var authService = require('./authenticationService');
var _ = require('underscore');
var multipart = require('multiparty');
var fileHandler = require('./../handler/fileHandler');

//userverifier

exports.registerUser = function (user, callback) {
    //todo verify data from user
    userRepo.userExists(user.username, function (err, exists) {
        if(err) callback(err);
        if (exists) {
            callback(new Error('Username already exists'));
        } else {
            var saltStr = salt.getSalt(user.password, ''); //empty string because the function will build the salt from scratch
            user.password = encryptPassword(user.password, saltStr);
            user.salt = saltStr;
            userRepo.registerUser(user, function (err, success) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, success);
                }
            });
        }
    });
};

exports.loginUser = function (credentials, callback) {
    userRepo.findUser(credentials.username, function(user) {
        if (user != null && validateUser(credentials.password, user.salt, user.password)) {
            var token = authService.issueToken(user._id);
            callback(null, token, filterUser(user));
        } else {
            callback(new Error('Username or password are incorrect.'));
        }
    });
};

exports.getAllUsers = function(callback) {
    userRepo.getUsers(function(err, users) {
        if(err) callback(err);
        var filteredUsers = filterUsers(users);
        callback(null, filteredUsers);
    });
};

exports.updateUser = function(params, calback) {
    authService.verifyToken(params.token, function(err, decoded) {
        if(err) calback(err);
        userRepo.findOneAndUpdate(decoded, params, function(err, user) {
            if(err) calback(err);
            calback(filterUser(user));
            //var conf = makeConfig(true, 'info', 'user modified successfully', userResult);
            //console.log(conf);
            //calback(conf);
        })
    })
};

exports.upload = function(req, callback) {
    var token = req.params.data;
    authService.verifyToken(token, function (err, decoded) {
        if(err) callback(err);
        userRepo.findUserById(decoded, function(err, user) {
            if(err) callback(err);
            fileHandler.createFile(req.files.file, user.username);
        });
    });
    callback(null);
};

exports.changePassword = function(params, callback) {
    authService.verifyToken(params.token, function(err, decoded) {
        if(err) callback(err);
        userRepo.findUserById(decoded, function(err, user) {
            if(user != null && !err && validateUser(params.oldPassword, user.salt, user.password)) {
                var encryptedPassword = encryptPassword(params.newPassword, salt);
                userRepo.findOneAndUpdate(decoded, {password: encryptedPassword}, callback);
                callback();
            } else {
                if(err) {
                    callback(err)
                } else {
                    callback(new Error('The password you provided was wrong!'));
                }
            }
        });
    });
};

function filterUser(user) {
    return _.omit(user, ['password', 'salt', '__v', '_id']);
}

function filterUsers(users) {
    if(users.length == 0) {
        return users;
    }
    var user = users.splice(0,1);
    var newUsers = filterUsers(users);
    newUsers.push(user);
    return newUsers;
}

function validateUser(submittedPassword, salt, password) {
    var encryptedPassword = md5.md5(submittedPassword + salt);
    return encryptedPassword === password;
}

function encryptPassword(password, salt) {
    return md5.md5(password + salt);
}