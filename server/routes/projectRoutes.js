/**
 * Created by Glenn on 13-4-2015.
 */
var async = require('async');
var config = require('./../config.json');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var userService = require('./../service/userService');
var auth = require('./../service/authenticationService');

exports.registerRoutes = function(app) {
    app.post('/project/create', createProject);
};

function createProject(req, res, next) {
    async.waterfall([
        function (callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function (userId, callback) {
            projectService.createProject(req.params, userId, callback);
        },
        function(messages, project, callback) {
            userService.findCollaborators(req.params.collaborators, function(err, usersExists) {
                callback(err, messages, project, usersExists);
            });
        },
        function (messages, project, usersExist, callback) {
            projectService.addCollabs(messages, project, usersExist, callback)
        }
    ], function(err, result) {
        console.log('after');
        var response = errorHandler.handleProjectErrors(err, result);
        res.send(response);
    });
    next();
}