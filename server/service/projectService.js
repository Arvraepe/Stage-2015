/**
 * Created by Glenn on 13-4-2015.
 */
var projectValidator = require('./../validator/projectValidator');
var projectRepo = require('./../repository/projectRepository');

exports.createProject = function(params, userId, callback) {
    console.log(params);
    var messages = projectValidator.validateNewProject(params);
    if(messages.length !== undefined && messages.length !== 0) {
        console.log('messages');
        callback(null, messages);
    } else {
        params.leader = userId;
        params.startDate = new Date();
        projectRepo.create(params, function(err, project) {
            if(err) callback(err);
            console.log(err);
            console.log(project);
            callback(null, null, project);
        });
    }
};

exports.addCollab = function(projectId, userId, callback) {
    console.log(projectId + '           ' + userId);
    projectRepo.addCollab(projectId, userId, callback);
};