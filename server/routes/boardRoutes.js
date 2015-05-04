/**
 * Created by Glenn on 21-4-2015.
 */
var async = require('async');
var auth = require('./../service/authenticationService');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var boardService = require('./../service/boardService');
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
        function(userId, callback) {
            boardService.createBoard(req.params, userId, callback);
        }
    ], function (err, result) {
        result = errorHandler.handleMMResult(err, {board: result}, result.messages, 'The ' + result.name + ' board was created for your project.');
        res.send(result);
    });
}

function getBoard(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            boardService.getBoard(req.params.boardId, userId, callback);
        }
    ], function(err, board) {
        var result = errorHandler.handleResult(err, { board: board }, 'Board fetched.');
        res.send(result);
    });
}

function updateBoard(req, res, next) {
    async.waterfall([
        function (callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            async.waterfall([
                function(callback) {
                    projectService.isLeader(req.params.projectId, userId, callback)
                },
                function (isLeader, callback) {
                    if (isLeader) {
                        boardService.updateBoard(req.params, function (err, board, messages) {
                            if(messages) callback(new Error('Unable to process the request'));
                            callback(err, board);
                        });
                    } else callback(new Error('You are not leader of this project, you cannot update a board.'));
                }
            ], function(err, board) {
                populateBoard(board, userId, callback);
            });
        }
    ], function (err, board) {
        var result = errorHandler.handleResult(err, {board: board}, 'Board updated.');
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
        result = errorHandler.handleResult(err, null, 'Board deleted.');
        res.send(result);
    });
}

function populateBoard(board, userId, callback) {
    async.parallel([
        function(callback) {
            projectService.getParentProject(board, userId, callback)
        },
        function(callback) {
            taskService.getTasks(board, callback)
        }
    ], function(err, results) {
        board.parentProject = results[0];
        board.tasks = results[1];
        callback(err, board);
    });
}