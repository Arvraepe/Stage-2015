var userService = require('./../service/userService');
var resultFactory = require('./../response/resultFactory');

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/login', login);
    app.get('/user/getallusers', getAllUsers);
    app.put('/user/updateuser', updateUser);
    app.post('/user/uploadavatar', uploadAvatar);
    app.put('/user/changepassword', changePassword)
};

function register(req, res, next) {
    userService.registerUser(req.params, function(err, success) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            if(success) {
                result = resultFactory.makeSuccessResult('User registered successfully');
            }
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

function getAllUsers(req, res, next) {
    userService.getAllUsers(function(err, users) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
        } else {
            var usersResult = resultFactory.makeUsersResult(users);
            result = resultFactory.makeSuccessResult(users.length + ' users fetched.', resultFactory.makeUsersResult(users));
        }
        res.send(result);
    });
    next();
}

function updateUser(req, res, next) {
    userService.updateUser(req.params, function(err, user) {
        var result;
        if(err) {
            result = resultFactory.makeFailureResult('ERROR', err.message);
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
            result = resultFactory.makeSuccessResult('Avater uploaded successfully.');
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
            result = resultFactory.makeSuccessResult('Avater uploaded successfully.');
        }
        res.send(result);
    });
    next();
}
