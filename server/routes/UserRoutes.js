var userRep = require('./../repository/userRepository')

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/user', login);
};

function register(req, res, next) {
    userRep.registerUser(req.params.username, req.params.password, req.params.email, req.params.firstname, req.params.lastname, function(result) {
        res.send(result);
    });
    next();
}

function login(req, res, next) {
    userRep.loginUser(req.params.username, req.params.password, function(result) {
        console.log(result);
        res.send(result);
    });
    next();
}