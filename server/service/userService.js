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
var validator = require('./../validator/userValidator');
var async = require('async');
var config  = require('./../config.json');


/**
 *
 * @param user
 * @param callback = function(err, messages, success) if messages is an object the server will send an error response with all the messages inside this object.
 */
exports.registerUser = function (user, callback) {
    var messages = validator.validateRegistration(user);
    if (messages.length === 0) {
        userRepo.userExists({username: user.username}, function (err, exists) {
            if (err) callback(err);
            if (exists) {
                callback(new Error('Username already exists'));
            } else {
                userRepo.userExists({email : user.email}, function (err, emailExists) {
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

/**
 *
 * @param credentials
 * @param callback = function(err, token, user) token is a json web token for session management, user is a user object who is now logged in.
 */
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


/**
 *
 * @param params
 * @param calback
 */
exports.updateUser = function (params, calback) {
    var messages = validator.validateUpdate(params);
    if (messages.length === undefined) {
        authService.verifyToken(params.token, function (err, decoded) {
            if (err) calback(err);
            userRepo.findUserById(decoded, function (err, user) {
                userRepo.userExists({email : user.email}, function(err, exists) {
                    if(user.email == params.email) {
                        exists = false;
                    }
                    if (err) calback(err);
                    if(exists) {
                        calback(new Error('A user has already registered using this email.'));
                    } else {
                        if (params.newPassword != undefined) {
                            params.oldPassword = params.oldPassword || '';
                            if (validateUser(params.oldPassword, user.salt, user.password)) {
                                params.password = encryptPassword(params.newPassword, user.salt);
                                userRepo.findOneAndUpdate(decoded, params, function (err, user) {
                                    if (err) calback(err);
                                    var filteredUser = filterUser(user);
                                    calback(null, null, filteredUser);
                                });
                            } else {
                                calback(new Error('Your password was incorrect, no changes have been made.'));
                            }
                        } else {
                            userRepo.findOneAndUpdate(decoded, params, function (err, user) {
                                if (err) calback(err);
                                var filteredUser = filterUser(user);
                                calback(null, null, filteredUser);
                            });
                        }
                    }
                });
            });
        })
    } else {
        calback(null, messages);
    }
};

exports.upload = function (req, callback) {
    var token = req.params.data;
    authService.verifyToken(token, function (err, decoded) {
        if (err) callback(err);
        userRepo.findUserById(decoded, function (err, user) {
            if (err) callback(err);
            fileHandler.createFile(req.files.file, user.username, function (err, ext) {
                if (err)callback(err);
                userRepo.findOneAndUpdate(decoded, {imageUrl: config.imageUrl + user.username + ext}, function (err, updatedUser) {
                    if (err) callback(err);
                    callback(null, filterUser(updatedUser));
                })
            });
        });
    });
};

exports.getUserFromToken = function (token, callback) {
    authService.verifyToken(token, function (err, decoded) {
        if (err) callback(err);
        userRepo.findUserById(decoded, function (err, user) {
            if (err)callback(err);
            callback(null, filterUser(user));
        })
    })
};

//exports.changePassword = function (params, callback) {
//    if(validator.validateChangedPassword(params.password)) {
//        authService.verifyToken(params.token, function (err, decoded) {
//            if (err) callback(err);
//            userRepo.findUserById(decoded, function (err, user) {
//                if (user != null && !err && validateUser(params.oldPassword, user.salt, user.password)) {
//                    var encryptedPassword = encryptPassword(params.newPassword, user.salt);
//                    userRepo.findOneAndUpdate(decoded, {password: encryptedPassword}, callback);
//                    callback();
//                } else {
//                    if (err) {
//                        callback(err)
//                    } else {
//                        callback(new Error('The password you provided was wrong!'));
//                    }
//                }
//            });
//        });
//    } else {
//        callback(new Error('The provided password is not valid.'));
//    }
//};

exports.resetPassword = function (params, callback) {
    userRepo.findUserByEmail(params.email, function (err, user) {
        if (err) callback(err);
        if(user == null) {
            callback(new Error('There is no user registered with that email'));
        } else {
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
                if (user.recovery.date < new Date()) {
                    user.recovery = undefined;
                } else {
                    callback(null, user.email, user.recovery.uuid);
                    return;
                }
            }
            userRepo.findOneAndUpdate(user._id, recovery, function (err, user) {
                if (err) callback(err);
                callback(null, user.email, user.recovery.uuid);
            });
        }
    });
};

exports.confirmReset = function (params, callback) {
    if (validator.validateChangedPassword(params.newPassword)) {
        userRepo.findUserByUuid(params.uuid, function (err, user) {
            if (err) callback(err);
            var encryptedPW = encryptPassword(params.newPassword, user.salt);
            userRepo.findOneAndUpdate(user._id, {password: encryptedPW}, function (err, updatedUser) {
                if (err) callback(err);
                callback(null, filterUser(updatedUser));
            });
        });
    } else {
        callback(new Error('The provided password is not valid.'))
    }
};

exports.userExists = function (params, callback) {
    var username = params.username || '';
    var email = params.email || '';
    if (username.length > 2) {
        userRepo.userExists({username: username}, callback);
    }
    if (email.length > 5) {
        userRepo.userExists({email: email}, callback);
    }
};

exports.confirmEmails = function (emails, callback) {
    var vEmails = [];
    var number = 0;
    var asyncTasks = [];
    emails.forEach(function (entry) {
        asyncTasks.push(function (cb) {
            userRepo.userExists(entry, cb);
        });
    });
    async.parallel(asyncTasks, function (err, result) {
        var counter = 0;
        result.forEach(function (exists) {
            if (!exists) {
                vEmails.push(emails[counter].email);
                number++;
            }
            counter++;
        });
        callback(null, vEmails, number);
    });
};

exports.findCollaborators = function (users, callback) {
    var tasks = [];
    users.forEach(function (entry) {
        if(entry.indexOf("@") > -1) {
            tasks.push(function(cb) {
                userRepo.findUserByEmail(entry, cb);
            });
        } else {
            tasks.push(function(cb) {
                userRepo.findUser(entry, cb);
            });
        }
    });
    async.parallel(tasks, function(err, results) {
        var counter = 0;
        var result = [];
        results.forEach(function (entry) {
            if (entry == null) {
                if(users[counter].indexOf("@") > -1) {
                    result.push({exists : false, email: users[counter]});
                } else {
                    result.push({exists : false, message: users[counter] + 'does not exist'});
                }
            } else {
                result.push({exists : true, user: entry});
            }
        });
        callback(err, result);
    });
};

exports.findALike = function(username, callback) {
    userRepo.findLike(username, function(err, users) {
        callback(err, filterUsers(users));
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