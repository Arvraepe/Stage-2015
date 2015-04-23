/**
 * Created by Glenn on 13-4-2015.
 */
var projectValidator = require('./../validator/projectValidator');
var projectRepo = require('./../repository/projectRepository');
var mailService = require('./../service/mailService');
var config = require('./../config.json');
var async = require('async');
var uuid = require('node-uuid');
var boardService = require('./boardService');

exports.createProject = function (params, userId, callback) {
    var messages = projectValidator.validateNewProject(params);
    if (messages.length !== undefined && messages.length !== 0) {
        callback(null, messages);
    } else {
        params.leader = userId;
        params.startDate = new Date();
        projectRepo.create(params, function (err, project) {

            var defaultBoard = getDefaultBoard(project.standardStates, project.deadline, project._id);
            console.log(defaultBoard);
            boardService.createBoard(defaultBoard, function(err, board) {
                console.log(board);
                callback(err, null, project);
            });
        });
    }
};

exports.checkAndAddCollabs = function (messages, project, usersExist, callback) {
    var tasks = [];
    usersExist.forEach(function (entry) {
        if (!entry.exists) {
            if (entry.email !== undefined) {
                tasks.push(function (cb) {
                    var uId = uuid.v1();
                    var link = config.domain + config.registerPath + entry.email + '/' + uId;
                    project.uniqueLinks = project.uniqueLinks || [];
                    project.uniqueLinks.push(uId);
                    projectRepo.findOneAndUpdate(project._id, project);
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
            results.push(project);
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
    isLeader(projectId, userId, function(err, leader) {
        if(leader) {
            projectRepo.deleteProject(projectId, callback);
        } else {
            callback(new Error('You are not the leader of this project, you cannot delete it.'));
        }
    });
};

exports.updateProject = function(userId, params, callback) {
    var messages = projectValidator.validateNewProject(params);
    isLeader(params._id, userId, function(err, isLeader) {
        if(isLeader) {
            projectRepo.findOneAndUpdate(params._id, params, function(err, result) {
                callback(err, messages, result);
            });
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
                project[0].leader = project[0].collaborators.splice(project[0].collaborators.indexOf(params.userId), 1)[0];
                project[0].collaborators.push(leaderId);
                projectRepo.findOneAndUpdate({_id : params.projectId}, project[0], callback);
            })
        }
    });
};

exports.addRegisteredCollab = function(userId, projectId, callback) {
    projectRepo.findProjects({uniqueLinks : projectId}, function(err, projects) {
        var project = projects[0];
        if(project == undefined) {
            callback(new Error('project does not exist'));
        } else {
            project.collaborators.push(userId);
            projectRepo.findOneAndUpdate(project._id, project, callback);
        }
    });
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
        if(project[0] == undefined) {
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

function getDefaultBoard(states, deadline, projectId) {
    var board = {
        name: 'General',
        description: 'General tasks of the project.',
        deadline: deadline,
        projectId: projectId,
        states: states
    };
    return board;
}