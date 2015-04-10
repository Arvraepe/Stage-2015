var userService = require('./../service/userService');
var resultFactory = require('./../response/resultFactory');
var mailService = require('./../service/mailService');
var config = require('./../config.json');
var fs = require('fs');

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/login', login);
    app.get('/user/exists', userExists);
    app.put('user/updateuser', updateUser);
    app.post('/user/uploadavatar', uploadAvatar);
    app.put('/user/changepassword', changePassword);
    app.post('/user/resetpassword', resetPassword);
    app.get('/user/uploads/:username', getImage);
    app.put('/user/resetpassword/confirm', confirmReset);
    app.post('/user/invitecoworkers', inviteCoWorkers);
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
            var data = resultFactory.makeUserLoginResult(user);
            data.token = token;
            result = resultFactory.makeSuccessResult('User logged in successfully.', data);
        }
        res.send(result);
    });
    next();
}

//function getAllUsers(req, res, next) {
//    userService.getAllUsers(function(err, users) {
//        var result;
//        if(err) {
//            result = resultFactory.makeFailureResult('ERROR', err.message);
//        } else {
//            result = resultFactory.makeSuccessResult(users.length + ' users fetched.', resultFactory.makeUsersResult(users));
//        }
//        res.send(result);
//    });
//    next();
//}

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
    userService.upload(req, function(err) {
        var result;
        if (err) {
            result = resultFactory.makeFailureResult('ERROR', 'Something went wrong while uploading your file.');
        } else {
            result = resultFactory.makeSuccessResult('Avatar uploaded successfully.');
        }
        res.send(result);
    });
    next();
}

function changePassword(req, res, next) {
    userService.changePassword(req.params, function(err) {
        var result;
        if (err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult('You can now log in with your new password.');
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
    userService.confirmReset(req.params, function(err) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            result = resultFactory.makeSuccessResult('You can now log in using your new password.');
        }
        res.send(result);
    });
    next();
}

function inviteCoWorkers(req, res, next) {
    var emails = '';
    req.params.forEach(function (entry) {
        emails += entry.email +', ';
    });
    emails = emails.replace(/,\s*$/, "");
    mailService.inviteCoworkers(emails, config.domain + config.registerPath, function(err, info) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', 'Something went wrong while sending out the mails.');
        } else {
            result = resultFactory.makeSuccessResult('Emails have been sent.');
        }
        res.send(result);
    });
    next();
}

function getImage(req, res, next) {
    var username = req.params.username;
    userService.getImage(username, function(err, base64Str, ext) {
        if(err) {
            res.send(resultFactory.makeFailureResult('ERROR', err.message));
        } else {
            res.writeHead(200, {'Content-Type': 'image/' + ext});
            res.end(base64Str);
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
