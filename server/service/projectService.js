/**
 * Created by Glenn on 13-4-2015.
 */
var projectValidator = require('./../validator/projectValidator');
var projectRepo = require('./../repository/projectRepository');

exports.createProject = function(params, callback) {
    var messages = projectValidator.validateNewProject(params);
    if(messages.length === undefined || messages.length === 0) {
        callback(null, messages);
    } else {
        projectRepo.create(params, function(err, project) {
            if(err) callback(err);
            callback(null, null, project);
        });
    }
};