/**
 * Created by Glenn on 24-4-2015.
 */
var async = require('async');
var auth = require('./../service/authenticationService');
var validator = require('./../validator/taskValidator');
var taskService = require('./../service/taskService');
var errorHandler = require('./../response/errorHandler');

exports.registerRoutes = function(app) {
    app.post('/task/create', createTask);
    app.get('/task', getTask);
    app.post('/task/comment', postComment);
    app.put('/task', updateTask);
    app.get('/tasks', getTasks);
    app.put('/task/comment', updateComment);
    app.del('/task/comment', deleteComment);
};

function createTask(req, res, next) {
    var task = req.params.task;
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            taskService.createTask(task, userId, callback);
        }
    ], function(err, task) {
        res.send(errorHandler.handleResult(err, { task: task }, 'A new task was created.'));
    });
}

function getTask(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            taskService.getTask(req.params._id, userId, callback);
        }
    ], function(err, result) {
        res.send(errorHandler.handleResult(err, result, 'Task fetched.'));
    })
}

function postComment(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            taskService.postComment(req.params._id, userId, req.params.comment, callback);
        }
    ], function(err, result) {
        res.send(errorHandler.handleResult(err, {comment:result}, 'Comment added to task.'));
    })
}

function updateTask(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function(userId, callback) {
            taskService.updateTask(req.params.task, userId, callback);
        }
    ], function(err, task) {
        res.send(errorHandler.handleResult(err, { task: task }, 'Task updated.'));
    });
}

function getTasks(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            taskService.getTasks(req.params.projectId, userId, callback);
        }
    ], function(err, tasks) {
        res.send(errorHandler.handleResult(err, { tasks: tasks }, tasks.length + ' tasks fetched.'));
    })
}

function updateComment(req, res, next) {
    async.waterfall([
        function (callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function (userId, callback) {
            taskService.updateComment(req.params.comment, req.params.taskId, userId, callback);
        }
    ], function(err, result) {
        res.send(errorHandler.handleResult(err, { comment: result }, 'Comment changed'));
    })
}

function deleteComment(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback);
        },
        function(userId, callback) {
            taskService.deleteComment(req.params.comment, req.params.taskId, userId, callback);
        }
    ], function(err) {
        res.send(errorHandler.handleResult(err, null, 'Comment deleted.'));
    })
}