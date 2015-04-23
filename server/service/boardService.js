/**
 * Created by Glenn on 21-4-2015.
 */
var boardRepo = require('./../repository/boardRepository');
var validator = require('./../validator/projectValidator');

exports.createBoard = function (params, callback) {
    var messages = validator.validateNewProject(params);
    boardRepo.create(params, function(err, result) {
        callback(err, result, messages);
    })
};

exports.getBoards = function (projectId, callback) {
    boardRepo.findBoards({projectId: projectId}, callback);
};