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

exports.checkAndAddCollabs = function (messages, project, usersExist, callback) {
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
                cb(null, {add: entry.user._id, projectId: project._id, leader : project.leader});
            });
        }
    });
    async.parallel(tasks, function (err, results) {
        var users = [];
        var projectId = '';
        var leaderEntry = {};
        results.forEach(function (entry) {
            if (entry.add != undefined) {
                if(entry.add != entry.leader) {
                    users.push(entry.add);
                    projectId = entry.projectId;
                } else {
                    leaderEntry = entry;
                    results.push({message : {code : 'WARN', message : 'You cannot add yourself to a project you own.'}});
                }
            }
        });
        async.filter(results, function (item, callback) {
            callback(item !== leaderEntry)
        }, function(filteredResults) {
            results = filteredResults;
        });
        results = results.filter(onlyUnique);
        if (users.length > 0) {
            addCollab(projectId, users, function (err, result) {
                results.push(result);
                callback(err, results);
            })
        } else {
            callback(null, results);
        }
    });
};

exports.getMyProjects = function(userId, callback) {
    projectRepo.findProjects({leader : userId}, callback);
};

exports.getOtherProjects = function(userId, callback) {
    projectRepo.findProjects({collaborators : userId}, callback);
};

exports.getProject = function(projectId, userId, callback) {
    checkProject(projectId, userId, callback);
};

exports.deleteProject = function(projectId, userId, callback) {
    isLeader(projectId, userId, function(err, project) {
        if(project) {
            projectRepo.deleteProject(projectId, callback);
        } else {
            callback(new Error('You are not the leader of this project, you cannot delete it.'));
        }
    });
};

exports.updateProject = function(userId, params, callback) {
    isLeader(params._id, userId, function(err, isLeader) {
        if(isLeader) {
            projectRepo.findOneAndUpdate(params._id, params, callback);
        } else {
            err = err || new Error('You cannot update a project you do not own.');
            callback(err);
        }
    });
};

exports.changeLeader = function (params, leaderId, callback) {
    isLeader(params.projectId, leaderId, function(err, isleader) {
        if(isleader) {
            projectRepo.findProjects({_id : params.projectId}, function(err, project) {
                console.log(project);
                project[0].leader = project[0].collaborators.splice(project[0].collaborators.indexOf(params.userId), 1)[0];
                project[0].collaborators.push(leaderId);
                projectRepo.findOneAndUpdate({_id : params.projectId}, project[0], callback);
            })
        }
    })
};

function addCollab(projectId, users, callback) {
    projectRepo.addCollab(projectId, users, callback);
}

function checkProject(projectId, userId, callback) {
    projectRepo.findProjects({_id : projectId}, function(err, projects) {
        var project = projects[0]; //we searched using id but the search returns an array, so we need the first element.
        if(project.leader == userId || project.collaborators.indexOf(userId) > -1) {
            callback(err, project);
        } else {
            callback(new Error('You have no rights to see this project.'));
        }
    });
}

function isLeader(projectId, userId, callback) {
    projectRepo.findProjects({_id: projectId}, function(err, project) {
        if(project == null) {
            callback(new Error('project does not exist'))
        } else if(project[0].leader == userId) {
            callback(err, true);
        } else {
            callback(err, false);
        }
    });
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}