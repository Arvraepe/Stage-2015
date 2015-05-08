/**
 * Created by Glenn on 8-5-2015.
 */
var notificationRepo = require('./../repository/notificationRepository');
var async = require('async');
var userService = require('./userService');
var projectService = require('./projectService');

exports.addUserNotification = function(oldCollaborators, project) {
    project.collaborators.forEach(function (collab, index, arr) {
        oldCollaborators.forEach(function (oldId, sIndex, sArr) {
            if(oldId == collab._id) {
                arr.splice(index, 1);
                sArr.splice(sIndex, 1);
            }
        });
    });
    var notifications = [];
    project.collaborators.forEach(function (collab) {
        var notification = {
            subjectDescriptor: {
                projectId: project._id,
                userId: collab._id
            },
            description: collab.name + " has been added to the " + project.name + " project",
            timeStamp: new Date(),
            type: 'UPDATE',
            subjectType: 'PROJECT'
        };
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
            var notification = {
                subjectDescriptor: {
                    projectId: project._id,
                    userId: user._id
                },
                description: user.firstname + " " + user.lastname + " has been removed from the " + project.name + " project",
                timeStamp: new Date(),
                type: 'UPDATE',
                subjectType: 'PROJECT'
            };
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
        if(!results) {
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