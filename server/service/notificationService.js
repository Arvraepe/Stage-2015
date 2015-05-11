/**
 * Created by Glenn on 8-5-2015.
 */
var notificationRepo = require('./../repository/notificationRepository');
var async = require('async');
var userService = require('./userService');
var projectService = require('./projectService');
var _ = require('underscore');

exports.addUserNotification = function(oldProject, oldCollaborators, project) {
    if(project.name != oldProject.name) {
        createUpdateNameProjectNotification(oldProject.name, project)
    }
    if(project.description != oldProject.description) {
        createUpdateDescriptionProjectNotification(project);
    }
    if(project.deadline != oldProject.deadline) {
        createUpdateDeadlineProjectNotification(oldProject.deadline, project);
    }
    var temp = [];
    oldCollaborators.forEach(function (oldId) {
        async.filter(project.collaborators, function(user, callback) {
            callback(user._id != oldId)
        }, function(results) {
            temp = results;
        });
    });
    project.collaborators.forEach(function (user) {
        async.filter(oldCollaborators, function(oldId, callback) {
            callback(oldId != user._id)
        },
        function(results) {
            console.log(results);
            oldCollaborators = results;
        });
    });
    project.collaborators = temp;
    var notifications = [];
    project.collaborators.forEach(function (collab) {
        var notification = makeUpdateProjectNotification(makeSubjectDescriptor(collab._id, project._id), " has been added to the " + project.name + " project");
        notifications.push(notification);
    });
    addNotifications(notifications);
    var tasks = [];
    oldCollaborators.forEach(function (id) {
        tasks.push(
            function(callback) {
                userService.findUser(id, callback);
            }
        )
    });
    async.parallel(tasks, function(err, results){
        var removeNotifications = [];
        results.forEach(function (user) {
            var notification = makeUpdateProjectNotification(makeSubjectDescriptor(user._id, project._id), " has been removed from the " + project.name + " project");
            removeNotifications.push(notification)
        });
        addNotifications(removeNotifications);
    });
};

exports.getNotificationsByUserId = function(userId, callback) {
    async.waterfall([
        function(callback) {
            projectService.getProjects(userId, callback);
        },
        function(projects, callback) {
            projects = projects.myProjects.concat(projects.otherProjects);
            var projectIds = [];
            projects.forEach(function (project) {
                projectIds.push(project._id)
            });
            getNotificationsByProjectIds(projectIds, callback);
        },
        function(notifications, callback) {
            populateNotifications(notifications, callback)
        }
    ], callback);
};

function populateNotifications(notifications, callback) {
    var tasks = [];
    notifications.forEach(function (not) {
        tasks.push(
            function(callback) {
                userService.populateComment(not.subjectDescriptor, callback);
            }
        );
    });
    async.parallel(tasks, function(err, results) {
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
            function(callback) {
                notificationRepo.find({ "subjectDescriptor.projectId": id }, callback);
            }
        )
    });
    async.parallel(tasks, function(err, results) {
        var allNotifications = [];
        if(results != undefined && results.length > 0) {
            allNotifications = allNotifications.concat.apply(allNotifications, results);
        }
        callback(err, allNotifications);
    })
}

function addNotifications(notifications) {
    var tasks = [];
    notifications.forEach(function (notification) {
        tasks.push(
            function(callback) {
                notificationRepo.create(notification, callback);
            }
        );
    });
    async.parallel(tasks);
}

function createUpdateNameProjectNotification(oldName, project) {
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), " has changed the name of the  " + oldName + " project to " + project.name);
    notificationRepo.create(notification);
}

function createUpdateDescriptionProjectNotification(project) {
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), " has changed the description of the " + project.name + " project");
    notificationRepo.create(notification);
}

function createUpdateDeadlineProjectNotification(oldDeadline, project) {
    var description = oldDeadline!= undefined ? " has moved the deadline from " + oldDeadline.toISOString().slice(0,10) + " to " + project.deadline.toISOString().slice(0,10) + " on the " + project.name : " has set a deadline on the " + project.name + " project to " + project.deadline.toISOString().slice(0, 10);
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), description);
    notificationRepo.create(notification);
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
    return{
        userId: userId,
        projectId: projectId,
        boardId: boardId,
        taskId: taskId
    };
}

function makeUpdateProjectNotification(subjectDescriptor, description) {
     return makeNotification(subjectDescriptor, description, "UPDATE", "PROJECT");
}
