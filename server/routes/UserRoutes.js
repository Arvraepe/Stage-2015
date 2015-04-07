var userService = require('./../service/userService');
var resultFactory = require('./../factory/resultFactory');

exports.registerRoutes = function (app) {

    app.post('/register', register);
    app.post('/login', login);
    app.get('/user/getallusers', getAllUsers);
    app.put('/user/updateuser', updateUser);
    app.post('/user/uploadavatar', uploadAvatar);
    app.put('user/changepassword', changePassword)
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
        res.send(result);
    }) ;
    next();
}

function uploadAvatar(req, res, next) {
    userService.upload(req, function(err) {
        if(err) console.log(err);
        var conf = {};
        conf.success = true;
        conf.messages.code = 'info';
        conf.messages.message = 'Avatar uploaded successfully.';
        var result =resultFactory.makeResult(conf);
        res.send(result);
    });
    next();
}

function changePassword(req, res, next) {

}
