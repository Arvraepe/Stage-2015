/**
 * Created by Glenn on 21-4-2015.
 */
var boardRepo = require('./../repository/boardRepository');
var validator = require('./../validator/projectValidator');
var projectService = require('./projectService');
var taskService = require('./taskService');
var async = require('async');
var _ = require('underscore');

exports.createBoard = function (params, userId, callback) {
    var messages = validator.validateBoard(params);
    if (messages.length > 0) {
        callback(messages);
    } else {
        async.waterfall([
            function (callback) {
                projectService.getProjectAsLeader(params.projectId, userId, callback);
            },
            function (project, callback) {
                boardRepo.create(params, callback);
            },
            function(board, callback) {
                board = board.toObject();
                convertState(board, callback);
            }
        ], callback);
    }
};

exports.getBoards = function (projectId, callback) {
    var select = 'name deadline states projectId';
    boardRepo.selectBoards({projectId: projectId}, select, callback);
};

exports.getBoard = function (boardId, userId, callback) {
    async.waterfall([
        function (callback) {
            getBoard(boardId, callback);
        },
        function (board, callback) {
            projectService.checkAuthority(board.projectId, userId, function (err) {
                callback(err, board);
            })
        },
        function (board, callback) {
            projectService.getParentProject(board, userId, function (err, project) {
                board.parentProject = project;
                callback(err, board);
            })
        },
        function (board, callback) {
            taskService.populateBoard(board, callback);
        }
    ], callback)
};

exports.convertStates = function (boards, callback) {
    var tasks = [];
    boards.forEach(function (board, index, array) {
        tasks.push(
            function(callback) {
                convertState(board, callback)
            }
        );
    });
    async.parallel(tasks, callback);
};

exports.updateBoard = function (board, userId, callback) {
    var projectId = board.projectId;
    board = filterBoard(board);
    async.waterfall([
        function (callback) {
            projectService.isLeader(projectId, userId, callback)
        },
        function (isLeader, callback) {
            if (isLeader) {
                var messages = validator.validateBoard(board);
                if (messages.length > 0) callback(messages);
                else boardRepo.findOneAndUpdate({_id: board._id}, board, callback);
            } else callback(new Error('You are not leader of this project, you cannot update a board.'));
        },
        function (board, callback) {
            populateBoard(board, userId, callback);
        }
    ], callback);
};

exports.delete = function (boardId, projectId, userId, callback) {
    async.waterfall([
        function (callback) {
            projectService.isLeader(projectId, userId, callback)
        },
        function (isLeader, callback) {
            if (isLeader) {
                boardRepo.findOneAndRemove(boardId, callback);
            } else {
                callback(new Error('You are not leader of this project, you cannot update a board.'));
            }
        }
    ], callback);
};

exports.checkAuthority = function (task, userId, callback) {
    async.waterfall([
        function (callback) {
            boardRepo.findBoard({_id: task.boardId}, callback)
        },
        function (board, callback) {
            projectService.checkAuthority(board.projectId, userId, callback);
        }
    ], function (err, authorized) {
        callback(err, authorized);
    });
};

exports.getStates = function (boardId, callback) {
    var select = "states";
    boardRepo.selectBoard({_id: boardId}, select, callback);
};

exports.getBoardById = function (boardId, callback) {
    boardRepo.findBoard({_id: boardId}, callback);
};

function getBoard(boardId, callback) {
    boardRepo.findBoard({_id: boardId}, callback);
}

function convertState(board, callback) {
    var newStates = [];
    var tasks = [];
    board.states.forEach(function (state) {
        tasks.push(
            function(callback) {
                getStateNumber(board._id, state, callback);
            }
        );
    });
    async.parallel(tasks, function(err, result) {
        board.states.forEach(function(state, index, arr) {
            var obj = {};
            obj[state] = result[index];
            newStates.push(obj);
        });
        board.statesMap = newStates;
        callback(err, board)
    });
}

function getStateNumber(boardId, state, callback) {
    taskService.getTaskCount(boardId, state, callback);
}

function populateBoard(board, userId, callback) {
    async.series([
        function (callback) {
            projectService.getParentProject(board, userId, callback)
        },
        function (callback) {
            taskService.populateBoard(board, callback)
        }
    ], function (err, results) {
        board = results[1];
        board.parentProject = results[0];
        callback(err, board);
    });
}

function filterBoard(board) {
    return _.pick(board, ['name', 'description', 'states', 'deadline', '_id'])
}