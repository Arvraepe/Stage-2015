/**
 * Created by Glenn on 27-4-2015.
 */
var async = require('async');
var taskRepo = require('./../repository/taskRepository');
var validator = require('./../validator/taskValidator');
var userService = require('./userService');
var boardService = require('./boardService');
var projectService = require('./projectService');

function getTaskIdentifier (boards, callback) {
    var tasks = [];
    boards.forEach(function (board) {
        tasks.push(function (callback) {
            taskRepo.getTaskIdentifier(board._id, callback);
        });
    });
    async.parallel(tasks, function (err, result) {
        var number = 1;
        result.forEach(function (identifier) {
            identifier.forEach(function (entry) {
                if (entry.identifier.length > 0) {
                    var iNumber = entry.identifier.split('-')[1];
                    if (iNumber >= number) {
                        number = parseInt(iNumber) + 1;
                    }
                }
            });
        });
        callback(err, number);
    });
}

exports.getTasks = function (board, callback) {
    async.waterfall([
        function (callback) {
            taskRepo.findTasks({boardId: board._id}, callback);
        },
        function (tasks, callback) {
            userService.populateTasks(tasks, callback)
        }
    ], callback)

};

exports.createTask = function (task, userId, callback) {
    var messages = validator.validateNewTask(task);
    if (messages.length > 0) callback(messages);
    else {
        async.waterfall([
            function (callback) {
                async.parallel([
                    function(callback) {
                        boardService.checkAuthority(task, userId, callback);
                    },
                    function(callback) {
                        boardService.checkAuthority(task, task.assignee, callback);
                    }
                ], callback)
            },
            function (authorized, callback) {
                if (!authorized[0]) callback(new Error('You are not a member of this project, you cannot create tasks.'));
                else if (!authorized[1]) callback(new Error('Assignee must be a member of the project'));
                else boardService.getBoard(task.boardId, callback);
            },
            function (board, callback) {
                task.creator = userId;
                task.state = board.states[0];
                boardService.getBoards(board.projectId, callback)
            },
            function (boards, callback) {
                async.parallel([
                    function(callback) {
                        getTaskIdentifier(boards, callback);
                    },
                    function(callback) {
                        projectService.getProjectCode(boards[0].projectId, callback);
                    }
                ], callback);
            },
            function(results, callback) {
                var number = results[0], code = results[1].code;
                task.identifier = code + '-' + number;
                taskRepo.create(task, function(err, task, number) {
                    callback(err, task.toObject());
                });
            },
            function(task, callback) {
                userService.populateTask(task, callback);
            }
        ], callback);
    }
};

exports.postComment = function(taskId, userId, comment, callback) {
    async.waterfall([
        function(callback) {
            boardService.checkAuthority(task, userId, callback)
        },
        function(authorized, callback) {
            if(!authorized) callback(new Error('You are not a member of this project, you can\'t comment on it'));
            else createComment(taskId, userId, comment, callback);
        },
        function(comment, callback) {
            userService.populateComment(comment, callback);
        }
    ], callback);
};

exports.getTask = function (taskId, userId, callback) {
    async.waterfall([
        function (callback) {
            taskRepo.findTask(taskId, callback);
        },
        function (task, callback) {
            boardService.checkAuthority(task, userId, function(err, authorized) {
                if(authorized) callback(err, task);
                else callback(new Error('Not authorized to see this task'));
            });
        },
        function (task, callback) {
            async.parallel([
                function (callback) {
                    boardService.getStates(task.boardId, callback);
                },
                function (callback) {
                    userService.populateTask(task, callback);
                }
            ], function (err, results) {
                callback(err, {boardStates: results[0].states, task: results[1]})
            });
        }
    ], callback);
};

exports.updateTask = function(task, userId, callback) {
    if(task.creator == userId || task.assignee == userId) {
        var messages = validator.validateNewTask(task);
        if(messages.length > 0) callback(messages);
        else {
            async.waterfall([
                function(callback) {
                    taskRepo.findOneAndUpdate({ _id: task._id }, task, callback);
                },
                function (task, callback) {
                    userService.populateTask(task, callback);
                }
            ], callback)
        }
    } else callback(new Error('You can not edit this task.'));
};

exports.getTasks = function(projectId, userId, callback) {
    async.waterfall([
        function(callback) {
            projectService.checkAuthority(projectId, userId, callback)
        },
        function(authorized, callback) {
            if(authorized) {
                taskRepo.findTasks({ projectId: projectId }, callback);
            }
        }
    ], callback)
};

function createComment(taskId, userId, comment, callback) {
    var comment = {
        userId: userId,
        comment: comment,
        timeStamp: new Date()
    };
    async.waterfall([
        function(callback) {
            taskRepo.findTask({ _id: taskId }, callback)
        },
        function(task, callback) {
            task.comments.push(comment);
            taskRepo.findOneAndUpdate({ _id: taskId }, task, callback);
        }
    ], function(err, task) {
        callback(err, comment);
    });
}