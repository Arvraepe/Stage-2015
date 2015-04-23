/**
 * Created by Glenn on 13-4-2015.
 */
var async = require('async');
var config = require('./../config.json');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var userService = require('./../service/userService');
var auth = require('./../service/authenticationService');
var boardService = require('./../service/boardService');

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
        function (messages, project, callback) {
            userService.findCollaborators(req.params.collaborators, function(err, userExists) {
                callback(err, messages, project, userExists)
            });
        },
        function(messages, project, userExists, callback) {
            projectService.checkAndAddCollabs(messages, project, userExists, callback);
        },
        function(result, callback) {
            var project = {};
            result.forEach(function (entry) {
                if(entry.description != undefined) {
                    project = entry;
                }
            });
            populateProject(project, function (err, pProject) {
                result[result.length -1] = pProject;
                callback(err, result);
            });
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
            populateProject(project, callback);
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
        },
        function (project, callback) {
            populateProject(project, callback);
        }
    ], function(err, result) {
        var response = errorHandler.handleResult(err, result, 'You are no longer leader of this project.');
        res.send(response);
    });
    next();
}

function populateProject(project, callback) {
    async.parallel([
        function(callback) {
            userService.getUsersFromProject(project.collaborators, project.leader, callback);
        },
        function(callback) {
            boardService.getBoards(project._id, function(err, boards) {
                boards.forEach(function (board) {
                    var newStates = [];
                    board.states.forEach(function (state) {
                        var obj = {};
                        obj[state] = 0; //todo count tasks
                        newStates.push(obj);
                    });
                    boards.states = newStates;
                });
                callback(err, boards);
            });
        }
    ], function(err, result) {
        project.leader = result[0].leader;
        project.collaborators = result[0].collaborators;
        project.boards = result[1];
        callback(err, project);
    });
}