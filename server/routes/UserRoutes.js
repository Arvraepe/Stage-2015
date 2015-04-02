var userService = require('./../service/userService');

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/login', login);
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