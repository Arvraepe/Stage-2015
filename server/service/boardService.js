/**
 * Created by Glenn on 21-4-2015.
 */
var boardRepo = require('./../repository/boardRepository');
var validator = require('./../validator/projectValidator');

exports.createBoard = function (params, callback) {
    var messages = validator.validateBoard(params);
    boardRepo.create(params, function(err, result) {
        callback(err, result, messages);
    })
};

exports.getBoards = function (projectId, callback) {
    boardRepo.findBoards({projectId: projectId}, callback);
};

exports.getBoard = function (boardId, callback) {
    //todo check userrights.
    boardRepo.findBoards({_id :boardId}, function(err, boards) {
        callback(err, boards[0]);
    })
};