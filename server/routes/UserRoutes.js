var userRep = require('./../repository/userRepository')

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.get('/user', function (req, res, next) {
        res.send('SUCCESS');
        next();
    });
};

function register(req, res, next) {
    console.log("in register methode");
    userRep.registerUser(req.params.username, req.params.password, req.params.email, req.params.firstname, req.params.lastname, function(result) {
        console.log("sending response");
        res.send(result);
    });
    next();
}