/**
 * Created by Glenn on 2-4-2015.
 */
var md5 = require('./../encryption/md5');
var salt = require('./../encryption/salt');
var userRepo = require('./../repository/userRepository');
var authService = require('./authenticationService');
var _ = require('underscore');
var fileHandler = require('./../handler/fileHandler');
var uuid = require('node-uuid');
var validator = require('./../validators/userValidator');

//userverifier

exports.registerUser = function (user, callback) {
    //todo verify data from user
    var messages = validator.validateRegistration(user);
    if (messages.length === 0) {
        userRepo.userExists(user.username, function (err, exists) {
            if (err) callback(err);
            if (exists) {
                callback(new Error('Username already exists'));
            } else {
                userRepo.emailExists(user.email, function (err, emailExists) {
                    if (err) callback(err);
                    if (emailExists) callback(new Error('A user has already registered using this email.'));
                    else {
                        var saltStr = salt.getSalt(user.password, ''); //empty string because the function will build the salt from scratch
                        user.password = encryptPassword(user.password, saltStr);
                        user.salt = saltStr;
                        userRepo.registerUser(user, function (err, success) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, null, success);
                            }
                        });
                    }
                });
            }
        });
    } else {
        callback(null, messages);
    }
};

exports.loginUser = function (credentials, callback) {
    userRepo.findUser(credentials.username, function (err, user) {
        if (user != null && validateUser(credentials.password, user.salt, user.password)) {
            var token = authService.issueToken(user._id);
            callback(null, token, filterUser(user));
        } else {
            callback(new Error('Username or password are incorrect.'));
        }
    });
};

exports.getAllUsers = function (callback) {
    userRepo.getUsers(function (err, users) {
        if (err) callback(err);
        var filteredUsers = filterUsers(users);
        callback(null, filteredUsers);
    });
};

exports.updateUser = function (params, calback) {
    authService.verifyToken(params.token, function (err, decoded) {
        if (err) calback(err);
        userRepo.findOneAndUpdate(decoded, params, function (err, user) {
            if (err) calback(err);
            var filteredUser = filterUser(user);
            calback(null, filteredUser);
        })
    })
};

exports.upload = function (req, callback) {
    var token = req.params.data;
    authService.verifyToken(token, function (err, decoded) {
        if (err) callback(err);
        userRepo.findUserById(decoded, function (err, user) {
            if (err) callback(err);
            fileHandler.createFile(req.files.file, user.username);
        });
    });
    callback(null);
};

exports.changePassword = function (params, callback) {
    authService.verifyToken(params.token, function (err, decoded) {
        if (err) callback(err);
        userRepo.findUserById(decoded, function (err, user) {
            if (user != null && !err && validateUser(params.oldPassword, user.salt, user.password)) {
                var encryptedPassword = encryptPassword(params.newPassword, user.salt);
                userRepo.findOneAndUpdate(decoded, {password: encryptedPassword}, callback);
                callback();
            } else {
                if (err) {
                    callback(err)
                } else {
                    callback(new Error('The password you provided was wrong!'));
                }
            }
        });
    });
};

exports.resetPassword = function (params, callback) {
    userRepo.findUserByEmail(params.email, function (err, user) {
        if (err) callback(err);
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var uId = uuid.v1();
        var recovery = {
            recovery: {
                date: tomorrow,
                uuid: uId
            }
        };
        if (user.recovery != undefined) {
            callback(new Error('A password reset has already been requested.'));
            return;
        }
        userRepo.findOneAndUpdate(user._id, recovery, function (err, user) {
            if (err) callback(err);
            callback(null, user.email, user.recovery.uuid);
        })
    });
};

exports.confirmReset = function (params, callback) {
    userRepo.findUserByUuid(params.uuid, function (err, user) {
        if (err) callback(err);
        var encryptedPW = encryptPassword(params.newPassword, user.salt);
        userRepo.findOneAndUpdate(user._id, {password: encryptedPW}, function (err, updatedUser) {
            if (err) callback(err);
            callback();
        });
    });
};

function filterUser(user) {
    return _.omit(user, ['password', 'salt', '__v', '_id', 'recovery']);
}

function filterUsers(users) {
    if (users.length == 0) {
        return users;
    }
    var user = filterUser(users.splice(0, 1)[0]);
    var newUsers = filterUsers(users);
    newUsers.push(user);
    return newUsers;
}

function validateUser(submittedPassword, salt, password) {
    var encryptedPassword = encryptPassword(submittedPassword, salt);
    return encryptedPassword === password;
}

function encryptPassword(password, salt) {
    return md5.md5(password + salt);
}