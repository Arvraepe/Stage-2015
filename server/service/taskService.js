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

exports.fillTasks = function(result, callback) {
    var board = result.board;
    var states = board.states, pTasks = [];
    board.states = [];
    getTasks(board._id, function(err, tasks) {
        states.forEach(function (state) {
            tasks.forEach(function (task) {
                if(task.state == state) {
                    pTasks.push(function(callback) {
                        async.parallel([
                            function(callback) {
                                userService.findUser({_id: task.assignee}, callback);
                            },
                            function(callback) {
                                userService.findUser({_id: task.creator}, callback);
                            }
                        ], function(err, result) {
                            task.assignee = result[0];
                            task.creator = result[1];
                            callback(err, task);
                        });
                    });
                }
            });
        });
        async.parallel(pTasks, function(err, tasks){
            states.forEach(function (state) {
                var stateObj = { name: state};
                stateObj.tasks = [];
                tasks.forEach(function (task) {
                    if(task.state == state) {
                        stateObj.tasks.push(task);
                    }
                });
                board.states.push(stateObj);
            });
            result.board = board;
            callback(err, result);
        });
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

function getTasks(boardId, callback) {
    taskRepo.findTasks({boardId: boardId}, callback);
}

function getTaskIdentifier(boardId, callback) {
    taskRepo.getTaskIdentifier(boardId, callback);
}
