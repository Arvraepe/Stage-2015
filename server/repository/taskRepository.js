/**
 * Created by Glenn on 27-4-2015.
 */
var mongoose = require('mongoose');
Task = mongoose.model('Task');

exports.getTaskIdentifier = function (boardId, callback) {
    Task.find({boardId: boardId}).select('identifier').lean().exec(callback);
};

exports.create = function(task, callback) {
    var newTask = new Task({
        title: task.title,
        description : task.description,
        boardId: task.boardId,
        creator : task.creator,
        identifier: task.identifier,
        important: task.important,
        deadline: task.deadline,
        state: task.state,
        assignee: task.assignee
    });
    newTask.save(callback);
};

exports.findTasks = function(condition, callback) {
    Task.find(condition).lean().exec(callback);
};

exports.findTask = function(condition, callback) {
    Task.findOne(condition).lean().exec(callback);
};

exports.findOneAndUpdate = function(condition, task, callback) {
    Task.findOneAndUpdate(condition, { new : true }, task, callback);
};