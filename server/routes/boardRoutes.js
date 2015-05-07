/**
 * Created by Glenn on 21-4-2015.
 */
var async = require('async');
var auth = require('./../service/authenticationService');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var boardService = require('./../service/boardService');

exports.registerRoutes = function (app) {
    app.post('/board/create', createBoard);
    app.get('/board', getBoard);
    app.put('/board', updateBoard);
    app.del('/board', deleteBoard);
    app.get('/boardsdescriptor', getBoards);
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
           boardService.updateBoard(req.params, userId, callback);
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
        function(userId, callback) {
            boardService.delete(req.params._id, req.params.projectId, userId, callback);
        }
    ], function (err, result) {
        result = errorHandler.handleResult(err, null, 'Board deleted.');
        res.send(result);
    });
}

function getBoards(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            boardService.getBoardsDesc(req.params.projectId, userId, callback);
        }
    ], function(err, result) {
        res.send(errorHandler.handleResult(err, { boards: result }, 'Boards fetched'));
    })
}