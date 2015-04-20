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
    app.get('/project/getprojects', getProjects);
    app.get('/project/getproject', getProject);
    app.del('/project/delete', deleteProject);
    app.put('/project/update', updateProject);
    app.put('/project/changeleader', changeLeader);
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
            projectService.checkAndAddCollabs(messages, project, usersExist, callback)
        }
    ], function(err, result) {
        var response = errorHandler.handleProjectErrors(err, result);
        res.send(response);
    });
    next();
}

function getProjects(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            projectService.getMyProjects(userId, function(err, myProjects) {
                callback(err, userId, myProjects);
            });
        },
        function(userId, myProjects, callback) {
            projectService.getOtherProjects(userId, function(err, otherProjects) {
                var result = {otherProjects : otherProjects, myProjects: myProjects};
                callback(err, result);
            });
        }
    ], function(err, result) {
        var response = errorHandler.handleResult(err, result);
        res.send(response);
    });
    next();
}

function updateProject(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            projectService.updateProject(userId, req.params, callback)
        },
        function (project, callback) {
            userService.findCollaborators(req.params.collaborators, function(err, userExists) {
                callback(err, project, userExists)
            });
        },
        function(project, userExists, callback) {
            projectService.checkAndAddCollabs(null, project, userExists, callback);
        }
    ], function(err, result) {
        var response = errorHandler.handleProjectErrors(err, result, 'Projects updated successfully.');
        res.send(response);
    });
    next();
}

function getProject(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            projectService.getProject(req.params.projectId, userId, callback);
        },
        function(project, callback) {
            userService.getUsersFromProject(project.collaborators, project.leader, function(err, result) {
                project.leader = result.leader;
                project.collaborators = result.collaborators;
                callback(err, project);
            });
        }
    ], function(err, result) {
        var response = errorHandler.handleResult(err, result, 'Project fetched successfully.');
        res.send(response);
    });
    next();
}

function deleteProject(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function (userId, callback) {
            projectService.deleteProject(req.params.projectId, userId, callback);
        }
    ], function(err, result) {
        var response = errorHandler.handleResult(err, {}, 'project has been deleted.');
        res.send(response);
    });
    next();
}

function changeLeader(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            projectService.changeLeader(req.params, userId, callback);
        }
    ], function(err, result) {
        var response = errorHandler.handleResult(err, result, 'You are no longer leader of this project.');
        res.send(response);
    });
    next();
}