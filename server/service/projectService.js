/**
 * Created by Glenn on 13-4-2015.
 */
var projectValidator = require('./../validator/projectValidator');
var projectRepo = require('./../repository/projectRepository');
var mailService = require('./../service/mailService');
var async = require('async');

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

exports.addCollabs = function(messages, project, usersExist, callback) {
    var tasks = [];
    usersExist.forEach(function (entry) {
        if(!entry.exists) {
            if(entry.email !== undefined) {
                tasks.push(function(cb) {
                    var link = config.domain + config.registerPath + '/' + entry.email + '/' +project._id
                    mailService.inviteCoworkers(entry.email, link, cb);
                })
            } else {
                tasks.push(function(cb) {
                    messages = messages || [];
                    messages.push({code:'WARN', message: entry.message});
                    cb(null, messages);
                });
            }
        } else {
            tasks.push(function(cb) {
                addCollab(project._id, entry.user._id, cb)
            });
        }
    });
    async.parallel(tasks, callback);
};

function addCollab(projectId, userId, callback) {
    projectRepo.addCollab(projectId, userId, callback);
}