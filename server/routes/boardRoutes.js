/**
 * Created by Glenn on 21-4-2015.
 */
var async = require('async');
var auth = require('./../service/authenticationService');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');
var boardService = require('./../service/boardService');

exports.registerRoutes = function(app) {
    app.post('/board/create', createBoard);
    app.get('/board', getBoard);
};

function createBoard(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            projectService.getProject(req.params.projectId, userId, function(err, project) {
                callback(err, project, userId);
            })
        },
        function (project, userId, callback) {
            if(project.leader != userId) callback(new Error('You are not the leader of this project, you cannot create boards.'));
            else boardService.createBoard(req.params, function(err, result, messages) {
                var results = { result : result, messages : messages };
                callback(err, results)
            });
        }
    ], function(err, result){
        result = errorHandler.handleMMResult(err, result.result, result.messages, 'A new board was created for your project.');
        res.send(result);
    });
}

function getBoard(req, res, next) {
    async.parallel([
        function(callback) {
            boardService.getBoard(req.params.boardId, callback);
        }
    ], function (err, result) {
        result = errorHandler.handleResult(err, {board : result[0]}, 'Board fetched succesfully.');
        res.send(result);
    });
}

