/**
 * Created by Glenn on 13-4-2015.
 */
var async = require('async');
var config = require('./../config.json');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var userService = require('./../service/userService');
var mailService = require('./../service/mailService');
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
            var tasks = [];
            usersExist.forEach(function (entry) {
                if(!entry.exists) {
                    if(entry.email !== undefined) {
                        tasks.push(function(cb) {
                            var link = config.domain + config.registerPath + '/' + entry.email + '/' +project._id
                            mailService.inviteCoworkers(entry.email, link, cb);
                        })
                    } else {
                        tasks.push(function(cb) {
                            messages = messages || [];
                            messages.push({code:'WARN', message: entry.message});
                            cb(null, messages);
                        });
                    }
                } else {
                    tasks.push(function(cb) {
                        projectService.addCollab(project._id, entry.user._id, cb)
                    });
                }
            });
            async.parallel(tasks, callback);
        }
    ], function(err, result) {
        var response = errorHandler.handleProjectErrors(err, result);
        res.send(response);
    });
    next();
}