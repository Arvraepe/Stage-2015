var userService = require('./../service/userService');
var resultFactory = require('./../response/resultFactory');
var mailService = require('./../service/mailService');
var config = require('./../config.json');
var async = require('async');

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
    app.get('/user/getuser', getUser);
};

function register(req, res, next) {
    userService.registerUser(req.params, function(err, messages, success) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else if(messages) {
            result = resultFactory.makeFailureMultipleMessages(messages);
        } else if(success){
            result = resultFactory.makeSuccessResult('User registered successfully');
        }
        res.send(result);
    });
    next();
}

function login(req, res, next) {
    userService.loginUser(req.params, function(err, token, user) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            var data = resultFactory.makeUserResult(user);
            data.token = token;
            result = resultFactory.makeSuccessResult('User logged in successfully.', data);
        }
        res.send(result);
    });
    next();
}

function updateUser(req, res, next) {
    userService.updateUser(req.params, function(err, messages, user) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else if (messages) {
            result = resultFactory.makeFailureMultipleMessages(messages);
        } else {
            var userResult = resultFactory.makeUserResult(user);
            result = resultFactory.makeSuccessResult('User modified successfully.', userResult);
        }
        res.send(result);
    });
    next();
}

function uploadAvatar(req, res, next) {
    userService.upload(req, function(err, user) {
        var result;
        if (err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult('Avatar uploaded successfully.', resultFactory.makeUserResult(user));
        }
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
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult('You can now log in using your new password.', resultFactory.makeUserResult(user));
        }
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
        console.log(result);
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
    userService.findALike(req.params.username, function(err, users) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult('Data retrieved', {users : users})
        }
        res.send(result);
    });
    next();
}

function getUser(req, res, next) {
    userService.findUser({_id : req.params.userId}, function(err, user) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult('Data retrieved', {user : user})
        }
        res.send(result);
    });
    next();
}