/**
 * Created by Glenn on 21-4-2015.
 */
var mongoose = require('mongoose');

Board = mongoose.model('Board');

exports.create = function (board, callback) {
    var newBoard = new Board({
        name: board.name,
        description: board.description,
        deadline: board.deadline,
        projectId: board.projectId,
        states: board.states
    });
    newBoard.save(callback);
};

exports.findBoards = function (condition, callback) {
    Board.find(condition).lean().exec(callback);
};

exports.findOneAndUpdate = function(condition, board, callback) {
    Board.findOneAndUpdate(condition, board, {new : true}).lean().exec(callback);
};

exports.findOneAndRemove = function(condition, callback) {
    Board.findOneAndRemove(condition, callback);
};

exports.findBoard = function (condition, callback) {
    Board.findOne(condition).lean().exec(callback);
};

exports.selectBoards = function(condition, select, callback) {
    Board.find(condition).select(select).lean().exec(callback);
};

exports.selectBoard = function(condition, select, callback) {
    Board.findOne(condition).select(select).lean().exec(callback);
};