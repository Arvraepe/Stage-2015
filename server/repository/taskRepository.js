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
        projectId: task.projectId,
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
    Task.findOneAndUpdate(condition, task, { new : true }).lean().exec(callback);
};

exports.addComment = function(taskId, comment, callback) {
    Task.findOne({ _id: taskId}, function(err, task) {
        task.comments.push(comment);
        task.save(callback);
    });
};

exports.deleteComment = function deleteComment(task, comment, callback) {
    Task.findOneAndUpdate({ _id: task._id}, { $pull: { comments: { _id: comment._id } } }, callback)
};

exports.updateComment = function(taskId, comment, callback) {
    Task.findOneAndUpdate({ _id: taskId, "comments._id": comment._id}, { $set: { "comments.$": comment } }, callback);
};