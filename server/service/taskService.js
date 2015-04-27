/**
 * Created by Glenn on 27-4-2015.
 */
var async = require('async');
var taskRepo = require('./../repository/taskRepository');
var validator = require('./../validator/taskValidator');

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
            var iNumber = identifier.split('-')[1];
            if(iNumber >= number) {
                number = iNumber + 1;
            }
        });
        callback(err, number);
    });
};

exports.createTask = function(task, callback) {
    var messages = validator.validateNewTask(task);
    if(messages.length > 0) {
        callback(null, null, messages);
    } else {
        taskRepo.create(task, callback);
    }
};

function getTaskIdentifier(boardId, callback) {
    taskRepo.getTaskIdentifier(boardId, callback);
}
