/**
 * Created by Glenn on 21-4-2015.
 */
var boardRepo = require('./../repository/boardRepository');
var validator = require('./../validator/projectValidator');

exports.createBoard = function (params, callback) {
    var messages = validator.validateBoard(params);
    if (messages.length > 0) {
        callback(null, null, messages)
    } else {
        boardRepo.create(params, function (err, result) {
            result = result.toObject();
            result.states = convertState(result);
            callback(err, result, messages);
        });
    }
};

exports.getBoards = function (projectId, callback) {
    boardRepo.findBoards({projectId: projectId}, callback);
};

exports.getBoard = function (boardId, callback) {
    boardRepo.findBoards({_id: boardId}, function (err, boards) {
        var board = boards[0];
        callback(err, board);
    });
};

exports.convertStates = function(boards) {
    boards.forEach(function (board, index, array) {
        array[index].states = convertState(board);
    });
    return boards;
};

exports.findOneAndUpdate = function(id, board, callback) {
    var messages = validator.validateBoard(board);
    if(messages.length > 0) callback(null, null, messages);
    else boardRepo.findOneAndUpdate({_id : id}, board, callback);
};

exports.delete = function(id, callback) {
    boardRepo.findOneAndRemove({_id : id}, callback);
};

function convertState(board) {
    var newStates = [];
    board.states.forEach(function (state) {
        var obj = {};
        obj[state] = 0; //todo count tasks
        newStates.push(obj);
    });
    return newStates;
}
