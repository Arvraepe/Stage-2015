/**
 * Created by Glenn on 21-4-2015.
 */
var boardRepo = require('./../repository/boardRepository');
var validator = require('./../validator/projectValidator');
var projectService = require('./projectService');
var taskService = require('./taskService');
var async = require('async');

exports.createBoard = function (params, userId, callback) {
    var messages = validator.validateBoard(params);
    if (messages.length > 0) {
        callback(messages);
    } else {
        async.series([
            function(callback) {
                projectService.getProjectAsLeader(params.projectId, userId, callback);
            },
            function(callback) {
                boardRepo.create(params, function (err, result) {
                    result = result.toObject();
                    result.statesMap = convertState(result);
                    callback(err, result);
                });
            }
        ], function(err, results) {
            callback(err, results[1]);
        });
    }
};

exports.getBoards = function (projectId, callback) {
    var select = 'name deadline states projectId';
    boardRepo.selectBoards({projectId: projectId}, select, callback);
};

exports.getBoard = function (boardId,userId,  callback) {
    async.waterfall([
        function(callback) {
            getBoard(boardId, callback);
        },
        function(board, callback) {
            projectService.getParentProject(board, userId, function(err, project) {
                board.parentProject = project;
                callback(err, board);
            })
        },
        function(board, callback) {
            taskService.populateBoard(board, callback);
        }
    ], callback)
};

exports.convertStates = function(boards) {
    boards.forEach(function (board, index, array) {
        array[index].statesMap = convertState(board);
    });
    return boards;
};

exports.updateBoard = function(board, callback) {
    var messages = validator.validateBoard(board);
    if(messages.length > 0) callback(null, null, messages);
    else boardRepo.findOneAndUpdate({_id : board._id}, board, callback);
};

exports.delete = function(id, callback) {
    boardRepo.findOneAndRemove({_id : id}, callback);
};

exports.checkAuthority = function(task, userId, callback) {
    async.waterfall([
        function(callback) {
            boardRepo.findBoard({ _id: task.boardId }, callback)
        },
        function(board, callback) {
            projectService.checkAuthority(board.projectId, userId, callback);
        }
    ], function(err, authorized) {
        callback(err, authorized);
    });
};

exports.getStates = function(boardId, callback) {
    var select = "states";
    boardRepo.selectBoard({ _id: boardId }, select, callback);
};

exports.getBoardById = function(boardId, callback) {
    boardRepo.findBoard({ _id: boardId }, callback);
};

function getBoard(boardId, callback) {
    boardRepo.findBoard({_id: boardId}, callback);
}

function convertState(board) {
    var newStates = [];
    board.states.forEach(function (state) {
        var obj = {};
        obj[state] = 0; //todo count tasks
        newStates.push(obj);
    });
    return newStates;
}
