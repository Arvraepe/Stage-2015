/**
 * Created by Glenn on 21-4-2015.
 */
var async = require('async');
var auth = require('./../service/authenticationService');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var boardService = require('./../service/boardService');
var userService = require('./../service/userService');
var taskService = require('./../service/taskService');

exports.registerRoutes = function (app) {
    app.post('/board/create', createBoard);
    app.get('/board', getBoard);
    app.put('/board', updateBoard);
    app.del('/board', deleteBoard);
};

function createBoard(req, res, next) {
    async.waterfall([
        function (callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            projectService.getProjectDesc(req.params.projectId, userId, function (err, project) {
                callback(err, project, userId);
            })
        },
        function (project, userId, callback) {
            console.log(project);
            if (project.leader != userId) callback(new Error('You are not the leader of this project, you cannot create boards.'));
            else boardService.createBoard(req.params, function (err, result, messages) {
                var results = {result: result, messages: messages};
                callback(err, results)
            });
        }
    ], function (err, result) {
        result = errorHandler.handleMMResult(err, {board: result.result}, result.messages, 'The ' + result.result.name + ' board was created for your project.');
        res.send(result);
    });
}

function getBoard(req, res, next) {
    async.waterfall([
        function (callback) {
            async.parallel([
                function (callback) {
                    boardService.getBoard(req.params.boardId, callback);
                },
                function (callback) {
                    auth.verifyToken(req.params.token, callback)
                }
            ], callback);
        },
        function (results, callback) {
            var board = results[0], userId = results[1];
            projectService.getProject(board.projectId, userId, function(err, project) {
                var result = { board: board, leader: project.leader, collaborators: project.collaborators};
                callback(err, result);
            });
        },
        function (result, callback) {
            taskService.fillTasks(result, callback);
        }
    ], function (err, result) {
        result = errorHandler.handleResult(err, result, 'Fetched board.');
        res.send(result);
    });
}

function updateBoard(req, res, next) {
    async.waterfall([
        function (callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            projectService.isLeader(req.params.projectId, userId, callback)
        },
        function (isLeader, callback) {
            if (isLeader) {
                boardService.findOneAndUpdate(req.params._id, req.params, function (err, board, messages) {
                    var result = {result: board, messages: messages};
                    callback(err, result);
                });
            } else {
                callback(new Error('You are not leader of this project, you cannot update a board.'));
            }
        }
    ], function (err, result) {
        result = errorHandler.handleMMResult(err, {board: result.result}, result.messages, 'Board updated.');
        res.send(result);
    });
}

function deleteBoard(req, res, next) {
    async.waterfall([
        function (callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            projectService.isLeader(req.params.projectId, userId, callback)
        },
        function (isLeader, callback) {
            if (isLeader) {
                boardService.delete(req.params._id, callback);
            } else {
                callback(new Error('You are not leader of this project, you cannot update a board.'));
            }
        }
    ], function (err, result) {
        result = errorHandler.handleResult(err, null, 'Board updated.');
        res.send(result);
    });
}