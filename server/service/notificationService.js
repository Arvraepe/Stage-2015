/**
 * Created by Glenn on 8-5-2015.
 */
var notificationRepo = require('./../repository/notificationRepository');
var async = require('async');
var userService = require('./userService');
var projectService = require('./projectService');
var _ = require('underscore');

exports.makeUpdateProjectNotifications = function (oldProject, oldCollaborators, project) {
    if (project.name != oldProject.name) {
        createUpdateNameProjectNotification(oldProject.name, project)
    }
    if (project.description != oldProject.description) {
        createUpdateDescriptionProjectNotification(project);
    }
    if (project.deadline.getTime() != oldProject.deadline.getTime()) {
        createUpdateDeadlineProjectNotification(oldProject.deadline, project);
    }
    var temp = [];
    async.filter(project.collaborators, function (user, callback) {
        var result = null;
        oldCollaborators.forEach(function (oldId) {
            if(oldId == user._id) {
                result = oldId;
            }
        });
        callback(result == null);
    }, function (results) {
        temp = results;
    });
    async.filter(oldCollaborators, function (oldId, callback) {
        var result = null;
        project.collaborators.forEach(function (user) {
            if (oldId == user._id) {
                result = oldId;
            }
        });
        callback(result == null);
    },
    function(results) {
        oldCollaborators = results;
    });
    project.collaborators = temp;
    var notifications = [];
    project.collaborators.forEach(function (collab) {
        var notification = makeJoinNotification(project, collab._id);
        notifications.push(notification);
    });
    addNotifications(notifications);
    var tasks = [];
    oldCollaborators.forEach(function (id) {
        tasks.push(
            function (callback) {
                userService.findUser(id, callback);
            }
        )
    });
    async.parallel(tasks, function (err, results) {
        var removeNotifications = [];
        results.forEach(function (user) {
            var notification = makeUpdateProjectNotification(makeSubjectDescriptor(user._id, project._id), " has been removed from the " + project.name + " project");
            removeNotifications.push(notification)
        });
        addNotifications(removeNotifications);
    });
};

exports.makeNewProjectNotifications = function(project) {
    var createNotifications = [makeCreateProjectNotification(project.creator, project._id, " has created the " + project.name + " project.")];
    project.collaborators.forEach(function (collab) {
        createNotifications.push(makeJoinNotification(project, collab));
    });
    addNotifications(createNotifications);
};

exports.makeJoinNotification = function(project, userId) {
    create(makeJoinNotification(project, userId));
};

exports.makeChangeLeaderNotification = function(project) {
    create(makeUpdateProjectNotification(makeSubjectDescriptor(project.leader, project._id), " has been promoted to leader of the " + project.name + " project."));
};

exports.getNotificationsByUserId = function (userId, callback) {
    async.waterfall([
        function (callback) {
            projectService.getProjects(userId, callback);
        },
        function (projects, callback) {
            projects = projects.myProjects.concat(projects.otherProjects);
            var projectIds = [];
            projects.forEach(function (project) {
                projectIds.push(project._id)
            });
            getNotificationsByProjectIds(projectIds, callback);
        },
        function (notifications, callback) {
            populateNotifications(notifications, callback)
        }
    ], callback);
};

function makeJoinNotification(project, userId) {
    return makeCreateProjectNotification(userId, project._id, " has been added to the " + project.name + " project.");
}

function populateNotifications(notifications, callback) {
    var tasks = [];
    notifications.forEach(function (not) {
        tasks.push(
            function (callback) {
                userService.populateComment(not.subjectDescriptor, callback);
            }
        );
    });
    async.parallel(tasks, function (err, results) {
        notifications.forEach(function (not, index, arr) {
            arr[index].subjectDescriptor = results[index];
        });
        callback(err, notifications);
    });
}

function getNotificationsByProjectIds(projectIds, callback) {
    var tasks = [];
    projectIds.forEach(function (id) {
        tasks.push(
            function (callback) {
                notificationRepo.find({"subjectDescriptor.projectId": id}, callback);
            }
        )
    });
    async.parallel(tasks, function (err, results) {
        var allNotifications = [];
        if (results != undefined && results.length > 0) {
            allNotifications = allNotifications.concat.apply(allNotifications, results);
        }
        callback(err, allNotifications);
    })
}

function addNotifications(notifications) {
    var tasks = [];
    notifications.forEach(function (notification) {
        tasks.push(
            function (callback) {
                notificationRepo.create(notification, callback);
            }
        );
    });
    async.parallel(tasks);
}

function createUpdateNameProjectNotification(oldName, project) {
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), " has changed the name of the  " + oldName + " project to " + project.name);
    create(notification);
}

function createUpdateDescriptionProjectNotification(project) {
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), " has changed the description of the " + project.name + " project");
    create(notification);
}

function createUpdateDeadlineProjectNotification(oldDeadline, project) {
    var description = oldDeadline != undefined ? " has moved the deadline from " + oldDeadline.toISOString().slice(0, 10) + " to " + project.deadline.toISOString().slice(0, 10) + " on the " + project.name : " has set a deadline on the " + project.name + " project to " + project.deadline.toISOString().slice(0, 10);
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), description);
    create(notification);
}

function makeNotification(subjectDescriptor, description, type, subjectType) {
    return {
        subjectDescriptor: subjectDescriptor,
        description: description,
        timeStamp: new Date(),
        type: type,
        subjectType: subjectType
    };
}

function makeSubjectDescriptor(userId, projectId, boardId, taskId) {
    return {
        userId: userId,
        projectId: projectId,
        boardId: boardId,
        taskId: taskId
    };
}

function makeUpdateProjectNotification(subjectDescriptor, description) {
    return makeNotification(subjectDescriptor, description, "UPDATE", "PROJECT");
}

function makeCreateProjectNotification(userId, projectId, description) {
    return makeNotification(makeSubjectDescriptor(userId, projectId), description, "CREATE", "PROJECT");
}

function create(notification) {
    notificationRepo.create(notification)
}
