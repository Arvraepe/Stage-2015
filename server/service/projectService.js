/**
 * Created by Glenn on 13-4-2015.
 */
var projectValidator = require('./../validator/projectValidator');
var projectRepo = require('./../repository/projectRepository');
var mailService = require('./../service/mailService');
var config = require('./../config.json');
var async = require('async');

exports.createProject = function (params, userId, callback) {
    var messages = projectValidator.validateNewProject(params);
    if (messages.length !== undefined && messages.length !== 0) {
        callback(null, messages);
    } else {
        params.leader = userId;
        params.startDate = new Date();
        projectRepo.create(params, function (err, project) {
            callback(err, null, project);
        });
    }
};

exports.addCollabs = function (messages, project, usersExist, callback) {
    var tasks = [];
    usersExist.forEach(function (entry) {
        if (!entry.exists) {
            if (entry.email !== undefined) {
                tasks.push(function (cb) {
                    var link = config.domain + config.registerPath + entry.email + '/' + project._id;
                    mailService.inviteCoworkers(entry.email, link, cb);
                })
            } else {
                tasks.push(function (cb) {
                    messages = messages || {};
                    messages.message = {code: 'WARN', message: entry.message};
                    cb(null, messages);
                });
            }
        } else {
            tasks.push(function (cb) {
                cb(null, {add: entry.user._id, projectId: project._id});
            });
        }
    });
    async.parallel(tasks, function (err, results) {
        var users = [];
        var projectId = '';
        results.forEach(function (entry) {
            if (entry.add != undefined) {
                users.push(entry.add);
                projectId = entry.projectId;
            }
        });
        if (users.length > 0) {
            addCollab(projectId, users, function (err, result) {
                callback(err, results);
            })
        } else {
            callback(null, results);
        }
    });
};

function addCollab(projectId, userId, callback) {
    projectRepo.addCollab(projectId, userId, callback);
}