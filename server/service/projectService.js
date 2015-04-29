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
var userService = require('./userService');

exports.createProject = function (params, userId, callback) {
    var messages = projectValidator.validateNewProject(params);
    if (messages.length !== undefined && messages.length !== 0) {
        callback(new Error('mult'), messages);
    } else {
        params.leader = userId;
        params.startDate = new Date();
        projectRepo.create(params, function (err, project) {
            var defaultBoard = getDefaultBoard(project.standardStates, project.deadline, project._id);
            boardService.createBoard(defaultBoard, function(err, board) {
                callback(err, null, project);
            });
        });
    }
};

exports.checkAndAddCollabs = function (messages, project, usersExist, callback) {
    var tasks = [];
    usersExist.forEach(function (entry) {
        if (!entry.exists) {
            if (entry.email !== undefined) { // this is an email that does not exist in our db, we will send an invitation email.
                tasks.push(function (cb) {
                    var uId = uuid.v1();
                    var link = config.domain + config.registerPath + entry.email + '/' + uId;
                    project.uniqueLinks = project.uniqueLinks || [];
                    project.uniqueLinks.push(uId);
                    projectRepo.findOneAndUpdate(project._id, project);
                    mailService.inviteCoworkers(entry.email, link, cb);
                });
            } else { //this is a string that is not a valid email address, the system will assume the user entered a username which is not in our db and will sent an appropriate WARN message.
                tasks.push(function (cb) {
                    messages = messages || {};
                    messages.message = {code: 'WARN', message: entry.message};
                    cb(null, messages);
                });
            }
        } else { //the user exists, callback with the required data.
            tasks.push(function (cb) {
                cb(null, {add: entry.user._id, projectId: project._id, leader : project.leader});
            });
        }
    });
    async.parallel(tasks, function (err, results) {
        var users = []; // this will contain all the existing users which will be added to the project
        var projectId = '';
        var leaderEntry = {};
        results.forEach(function (entry) {
            if (entry.add != undefined) { // this is a user that exists
                if(entry.add != entry.leader) { // add to the users array
                    users.push(entry.add);
                    projectId = entry.projectId; //set the projectId, will be the same value for every entry that has 'add' property
                } else {//leader tried to add himself as a collaborator, this is not possible.
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

exports.getProjects = function(userId, callback) {
    async.parallel([
        function(callback) {
            getMyProjects(userId, callback);
        },
        function(callback) {
            getOtherProjects(userId, callback);
        }
    ], function(err, results) {
        var result = {
            myProjects: results[0],
            otherProjects: results[1]
        };
        callback(err, result);
    })
};

exports.getProject = function(projectId, userId, callback) {
    async.waterfall([
        function(callback) {
            checkProject(projectId, userId, callback);
        },
        function(project, callback) {
            populateProject(project, callback);
        }
    ], callback);
};

exports.deleteProject = function(projectId, userId, callback) {
    projectRepo.deleteProject({ _id: projectId, leader: userId }, callback);
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
    async.waterfall([
        function(callback) {
            isLeader(params.projectId, leaderId, callback);
        },
        function(project, callback) {
            if(!project) callback(new Error('You cannot promote someone to leader if you are not the leader.'));
            else {
                project.leader = project.collaborators.splice(project.collaborators.indexOf(params.userId), 1)[0];
                project.collaborators.push(leaderId);
                projectRepo.findOneAndUpdate({ _id : params.projectId }, project, callback);
            }
        },
        function(project, callback) {
            populateProject(project, callback);
        }
    ], callback);
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

exports.isLeader = function(projectId, userId, callback) {
    isLeader(projectId, userId, callback);
};

exports.processUpdate = function(result, callback) {
    var project = {};
    result.forEach(function (entry) {
        if(entry.description != undefined) {
            project = entry;
        }
    });
    populateProject(project, function (err, pProject) {
        result[result.length -1] = pProject;
        callback(err, result);
    });
};

exports.getProjectDesc = function(projectId, userId, callback) {
    checkProject(projectId, userId, callback);
};

exports.getParentProject = function(board, userId, callback) {
    var select = "name code collaborators leader startDate deadline";
    async.waterfall([
        function(callback) {
            projectRepo.selectProject({_id: board.projectId}, select, callback);
        },
        function(project, callback) {
            if(userInProject(project, userId)) userService.getUsersFromProject(project, callback);
            else callback(new Error('You are not a member of this project.'));
        }
    ], callback);
};

exports.checkAuthority = function(board, userId, callback) {
    async.waterfall([
        function(callback) {
            projectRepo.findProject({ _id: board.projectId }, callback);
        },
        function(project, callback) {
            if(userInProject(project, userId)) callback(null, board);
            else callback(new Error('You are not a member of the project, you cannot see any of it\'s components'));
        }
    ], callback)
};

exports.getMembers = function(projectId, userId, callback) {
    var select = "leader collaborators";
    projectRepo.selectProject({ _id: projectId }, select, function(err, project) {
        if(userInProject(project, userId)) {
            var result = project.collaborators;
            result.push(project.leader);
            callback(err, result)
        } else {
            callback(new Error('You are not a member of the project, you cannot see any of it\'s components'));
        }
    });
};

function getMyProjects(userId, callback) {
    projectRepo.findProjects({leader : userId}, callback);
}

function getOtherProjects(userId, callback) {
    projectRepo.findProjects({collaborators : userId}, callback);
}

function userInProject(project, userId) {
    return project.leader == userId || project.collaborators.indexOf(userId) > -1;
}

function addCollab(projectId, users, callback) {
    projectRepo.addCollab(projectId, users, callback);
}

function checkProject(projectId, userId, callback) {
    projectRepo.findProject({_id : projectId}, function(err, project) {
        var project = project;
        if(project.leader == userId || project.collaborators.indexOf(userId) > -1) {
            callback(err, project);
        } else {
            callback(new Error('You have no rights to see this project.'));
        }
    });
}


function isLeader(projectId, userId, callback) {
    projectRepo.findProject({_id: projectId}, function(err, project) {
        if(project == undefined) {
            callback(new Error('project does not exist'))
        } else if(project.leader == userId) {
            callback(err, project);
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

function populateProject(project, callback) {
    async.parallel([
        function(callback) {
            userService.getUsersFromProject(project, callback);
        },
        function(callback) {
            boardService.getBoards(project._id, function(err, boards) {
                boards = boardService.convertStates(boards);
                callback(err, boards);
            });
        }
    ], function(err, result) {
        project = result[0];
        project.boards = result[1];
        callback(err, project);
    });
}

exports.getProjectAsLeader = function(projectId, userId, callback) {
    projectRepo.findProject({_id: projectId}, function(err, project) {
        if(project.leader == userId) callback(err, project);
        else callback(new Error('You are not the leader of the project.'));
    });
};