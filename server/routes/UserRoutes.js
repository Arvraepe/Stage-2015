var userService = require('./../service/userService');

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/login', login);
    app.get('/user/getallusers', getAllUsers);
    app.put('user/updateuser', updateUser);
};

function register(req, res, next) {
    userService.registerUser(req.params, function(result) {
        res.send(result);
    });
    next();
}

function login(req, res, next) {
    userService.loginUser(req.params, function(result) {
        res.send(result);
    });
    next();
}

function getAllUsers(req, res, next) {
    userService.getAllUsers(function(result) {
        res.send(result);
    });
    next();
}

function updateUser(req, res, next) {
    userService.updateUser(req.params, function(result) {
        res.send(result)
    }) ;
    next();
}
