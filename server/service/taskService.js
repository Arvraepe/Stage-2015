/**
 * Created by Glenn on 27-4-2015.
 */
var async = require('async');
var taskRepo = require('./../repository/taskRepository');
var validator = require('./../validator/taskValidator');
var userService = require('./../service/userService');

exports.getTaskIdentifier = function (boards, callback) {
    var tasks = [];
    boards.forEach(function(board) {
        tasks.push(function(callback) {
            getTaskIdentifier(board._id, callback);
        });
    });
    async.parallel(tasks, function(err, result) {
        var number = 1;
        result.forEach(function (identifier) {
            identifier.forEach(function(entry){
                if(entry.identifier.length > 0) {
                    var iNumber = entry.identifier.split('-')[1];
                    if (iNumber >= number) {
                        number = parseInt(iNumber) + 1;
                    }
                }
            });
        });
        callback(err, number);
    });
};

exports.getTasks = function(board, callback) {
    async.waterfall([
        function(callback) {
            taskRepo.findTasks({ boardId: board._id }, callback);
        },
        function(tasks, callback) {
            userService.populateTasks(tasks, callback)
        }
    ], callback)

};

exports.createTask = function(task, callback) {
    var messages = validator.validateNewTask(task);
    if(messages.length > 0) {
        callback(null, null, messages);
    } else {
        taskRepo.create(task, callback);
    }
};

function getTasks(boardId, callback) {
    taskRepo.findTasks({boardId: boardId}, callback);
}

function getTaskIdentifier(boardId, callback) {
    taskRepo.getTaskIdentifier(boardId, callback);
}
