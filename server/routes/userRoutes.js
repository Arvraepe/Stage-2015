var userService = require('./../service/userService');
var resultFactory = require('./../response/resultFactory');
var mailService = require('./../service/mailService');
var config = require('./../config.json');
var async = require('async');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var auth = require('./../service/authenticationService');

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/login', login);
    app.get('/user/exists', userExists);
    app.put('user/updateuser', updateUser);
    app.post('/user/uploadavatar', uploadAvatar);
    app.post('/user/resetpassword', resetPassword);
    app.put('/user/resetpassword/confirm', confirmReset);
    app.post('/user/invitecoworkers', inviteCoWorkers);
    app.get('/user/findlike', findLike);
};

function register(req, res, next) {
    async.waterfall([
        function(callback) {
            userService.registerUser(req.params, callback);
        },
        function(messages, user, callback) {
            var result = { messages : messages };
            if(req.params.projectId != undefined) {
                projectService.addRegisteredCollab(user._id, req.params.projectId, function(err) {
                    callback(err, result);
                });
            } else callback(null, result);
        }
    ], function(err, result) {
        result = errorHandler.handleMMResult(err, null, result.messages, 'User registered successfully'); //response doesn't need a data object, so give null as param.
        res.send(result);
    });
    next();
}

function login(req, res, next) {
    userService.loginUser(req.params, function(err, token, user) {
        var result = errorHandler.handleUser(err, user, token);
        res.send(result);
    });
    next();
}

function updateUser(req, res, next) {
    userService.updateUser(req.params, function(err, messages, user) {
        var userResult = errorHandler.makeUserData(user);
        var result = errorHandler.handleMMResult(err, userResult, messages, 'User modified successfully.');
        res.send(result);
    });
    next();
}

function uploadAvatar(req, res, next) {
    userService.upload(req, function(err, user) {
        var result = errorHandler.handleResult(err, errorHandler.makeUserData(user), 'Avatar uploaded successfully.');
        res.send(result);
    });
    next();
}

function resetPassword(req, res, next) {
    userService.resetPassword(req.params, function(err, email, uuid) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
            res.send(result);
        } else {
            mailService.sendRecoveryMail(email, config.domain + config.recoverPath + uuid, function(err, info) {
                //todo use info data
                if(err) {
                    result = resultFactory.makeFailureResult('ERROR', err.message);
                } else {
                    result = resultFactory.makeSuccessResult('A mail has been sent to your email address');
                }
                res.send(result);
            });
        }
    });
    next();
}

function confirmReset(req, res, next) {
    userService.confirmReset(req.params, function(err, user) {
        var result = errorHandler.handleResult(err, errorHandler.makeUserData(user), 'You can now log in using your new password.');
        res.send(result);
    });
    next();
}

function inviteCoWorkers(req, res, next) {
    var tasks = [
        function(callback) {
            userService.confirmEmails(req.params, callback);
        },
        function(vEmails, number, callback) {
            var pTasks = [];
            vEmails.forEach(function (entry) {
                var link = config.domain + config.registerPath + entry;
                pTasks.push(function(cb) {
                    mailService.inviteCoworkers(entry, link, cb);
                })
            });
            async.parallel(pTasks, function(err, result) {
                callback(err, number, result);
            });
        },
        function(number, results, callback) {
            var result;{
                var message = number == 1 ? '1 email has been sent.' : number + ' emails have been sent.';
                result = resultFactory.makeSuccessResult(message);
            }
           callback(null, result);
        }
    ];
    async.waterfall(tasks, function(err, result) {
        if (err) {
            res.send(resultFactory.makeFailureResult('ERROR', err.message));
        } else {
            res.send(result);
        }
    });
    next();
}

function userExists(req, res, next) {
    userService.userExists(req.params, function(err, exists) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult(null, {exists: exists});
        }
        res.send(result);
    });
    next();
}

function findLike(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            projectService.getMyProjects(userId, function (err, projects) {
                callback(err, userId, projects);
            });
        },
        function (userId, myProjects, callback) {
            projectService.getOtherProjects(userId, function (err, projects) {
                callback(err, userId, myProjects, projects);
            });
        },
        function (userId, myProjects, otherProjects, callback) {
            userService.findALike(req.params.username, function(err, users) {
                callback(err, userId, myProjects, otherProjects, users);
            });
        },
        function (userId, myProjects, otherProjects, users, callback) {
            userService.sortResults(userId, myProjects, otherProjects, users, callback);
        }
    ], function(err, result) {
        var result = errorHandler.handleResult(err, {users : result}, 'Users fetched successfully.');
        res.send(result);
    });
    next();
}
