/**
 * Created by Glenn on 24-4-2015.
 */
var async = require('async');
var auth = require('./../service/authenticationService');
var validator = require('./../validator/taskValidator');
var boardService = require('./../service/boardService');
var projectService = require('./../service/projectService');
var taskService = require('./../service/taskService');
var errorHandler = require('./../response/errorHandler');
var userService = require('./../service/userService');

exports.registerRoutes = function(app) {
    app.post('/task/create', createTask);
};

function createTask(req, res, next) {
    var task = req.params.task;
    async.waterfall([
        function(callback) {
            async.parallel([
                function(callback) {
                    auth.verifyToken(req.params.token, callback);
                },
                function(callback) {
                    boardService.getBoard(task.boardId, callback)
                }
            ], callback);
        },
        function(results, callback) {
            var userId = results[0], board = results[1];
            task.state = board.states[0];
            task.creator = userId;
            async.parallel([
                function(callback) {
                    projectService.getProjectDesc(board.projectId, userId, callback);
                },
                function(callback) {
                    boardService.getBoards(board.projectId, callback);
                }
            ], callback);
        },
        function(results, callback) {
            var project = results[0], boards = results[1];
            if(project.leader == task.assignee || project.collaborators.indexOf(task.assignee) > -1) {
                taskService.getTaskIdentifier(boards, function(err, number) {
                    task.identifier = project.code + '-' + number;
                    callback(err);
                });
            } else {
                callback(new Error('Assignee needs to be a member of the project.'));
            }
        }, function(callback) {
            taskService.createTask(task, function(err, result, messages) {
                callback(err, task, messages);
            });
        },
        function(task, messages, callback) {
            if(messages.length > 0) callback(new Error());
            userService.populateTask(task, callback);
        }
    ], function(err, result) {
        result = errorHandler.handleMMResult(err, { task: result }, result.messages, 'A new task was created.');
        res.send(result);
    })
}

