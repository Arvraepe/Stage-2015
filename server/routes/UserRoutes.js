var userRep = require('./../repository/userRepository')

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.get('/user', function (req, res, next) {
        res.send('SUCCESS');
        next();
    });
};

function register(req, res, next) {
    var result = userRep.registerUser(req.params.username, req.params.password, req.params.email, req.params.firstname, req.params.lastname, function(result) {
        res.send(result);
    });
    next();
}