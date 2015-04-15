/**
 * Created by Glenn on 13-4-2015.
 */
var projectValidator = require('./../validator/projectValidator');
var projectRepo = require('./../repository/projectRepository');

exports.createProject = function(params, userId, callback) {
    var messages = projectValidator.validateNewProject(params);
    if(messages.length !== undefined && messages.length !== 0) {
        callback(null, messages);
    } else {
        params.leader = userId;
        params.startDate = new Date();
        projectRepo.create(params, function(err, project) {
            callback(err, null, project);
        });
    }
};

exports.addCollab = function(projectId, userId, callback) {
    projectRepo.addCollab(projectId, userId, callback);
};