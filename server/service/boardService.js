/**
 * Created by Glenn on 21-4-2015.
 */
var boardRepo = require('./../repository/boardRepository');
var validator = require('./../validator/projectValidator');
var projectService = require('./projectService');
var async = require('async');

exports.createBoard = function (params, callback) {
    var messages = validator.validateBoard(params);
    if (messages.length > 0) {
        callback(null, null, messages)
    } else {
        boardRepo.create(params, function (err, result) {
            result = result.toObject();
            result.statesMap = convertState(result);
            callback(err, result, messages);
        });
    }
};

exports.getBoards = function (projectId, callback) {
    var select = 'name deadline states';
    boardRepo.selectBoards({projectId: projectId}, select, callback);
};

exports.getBoard = function (boardId, callback) {
    getBoard(boardId, callback);
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
            projectService.checkAuthority(board, userId, callback);
        }
    ], function(err, board) {
        callback(err, board.states, task);
    });
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
