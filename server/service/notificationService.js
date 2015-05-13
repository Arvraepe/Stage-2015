/**
 * Created by Glenn on 8-5-2015.
 */
var notificationRepo = require('./../repository/notificationRepository');
var async = require('async');
var userService = require('./userService');
var projectService = require('./projectService');
var boardService = require('./boardService');
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
    var createNotifications = [makeCreateProjectNotification(project.leader, project._id, " has created the " + project.name + " project.")];
    project.collaborators.forEach(function (collab) {
        createNotifications.push(makeJoinNotification(project, collab));
    });
    addNotifications(createNotifications);
};

exports.makeJoinNotification = function(project, userId) {
    create(makeJoinNotification(project, userId));
};

exports.makeChangeLeaderNotification = function(project) {
    create(makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), " has been promoted to leader of the " + project.name + " project."));
};

exports.getNotificationsByUserId = function (userId, limit, timeStamp, callback) {
    timeStamp = timeStamp || new Date();
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
            getNotificationsByProjectIds(projectIds, limit, timeStamp, callback);
        },
        function (notifications, callback) {
            populateNotifications(notifications, callback)
        }
    ], callback);
};

exports.getNotificationsByBoard = function(boardId, limit, userId, callback) {
    async.waterfall([
        function(callback) {
            boardService.getBoard(boardId, userId, callback)
        },
        function(board, callback){
            notificationRepo.findLimit({ "subjectDescriptor.boardId": board._id }, limit, callback)
        },
        function(notifications, callback) {
            populateNotifications(notifications, callback);
        }
    ], callback)
};

exports.makeCreateBoardNotification = function(board, userId) {
    projectService.getProjectDesc(board.projectId, userId, function(err, project) {
        create(makeCreateBoardNotification(userId, board.projectId, board._id, " has created the " + board.name + " board in the " + project.name + " project"));
    });
};

exports.makeUpdateBoardNotification = function(oldBoard, newBoard, userId) {
    projectService.getProjectDesc(newBoard.projectId, userId, function(err, project) {
        if(oldBoard.name != newBoard.name) {
            createBoardNameNotification(oldBoard.name, newBoard, project.name, userId);
        }
        if(oldBoard.description != newBoard.description) {
            createBoardDescriptionNotification(project.name, newBoard, userId);
        }
        if(oldBoard.deadline.getTime() != newBoard.deadline.getTime()) {
            createBoardDeadlineNotification(oldBoard.deadline, newBoard, project.name, userId);
        }
    })
};

exports.makeCreateTaskNotification = function(task, userId) {
    async.parallel([
        function(callback) {
            projectService.getProjectDesc(task.projectId, userId, callback);
        },
        function(callback) {
            boardService.getBoardById(task.boardId, callback);
        }
    ], function(err, results) {
        var project = results[0], board = results[1];
        var notifications = [];
        var description = " has created a new task on the " + board.name + " board in the " + project.name + " project.";
        notifications.push(makeCreateTaskNotification(userId, project._id, board._id, task._id, description));
        notifications.push(makeCreateTaskNotification(task.assignee._id, project._id, board._id, task._id, " has been assigned to the " + task.identifier + " task"));
        addNotifications(notifications);
    });
};

exports.makeUpdateTaskNotification = function (oldTask, newTask, userId) {
    async.parallel([
        function(callback) {
            projectService.getProjectDesc(newTask.projectId, userId, callback);
        },
        function(callback) {
            boardService.getBoardById(newTask.boardId, callback);
        }
    ], function(err, results) {
        var project = results[0], board = results[1];
        if(oldTask.title != newTask.title) {
            createTaskTitleNotification(oldTask.title, newTask, project.name, board.name, userId);
        }
        if(oldTask.description != newTask.description) {
            createTaskDescriptionNotification(task, project.name, board.name, userId);
        }
        if(oldTask.important != newTask.important) {
            createTaskImportantNotification(newTask, project.name, board.name, userId)
        }
        if(oldTask.deadline != undefined && newTask.deadline != undefined && oldTask.deadline.getTime() != newTask.deadline.getTime()) {
            createTaskDeadlineNotification(oldTask.deadline, task, project.name, board.name, userId);
        }
        if(oldTask.assignee != newTask.assignee._id) {
            createTaskAssigneeNotification(newTask, project.name, board.name);
        }
        if(oldTask.state != newTask.state) {
            createTaskStateNotification(oldTask.state, newTask, project.name, board.name, userId);
        }
    });
};

exports.makeSwitchBoardNotification = function(task, newId, userId) {
    async.parallel([
        function(callback) {
            boardService.getBoardById(task.boardId, callback);
        },
        function(callback) {
            boardService.getBoardById(newId, callback);
        },
        function(callback) {
            projectService.getProjectDesc(task.projectId, userId, callback);
        }
    ], function(err, results) {
        createTaskChangeBoardNotification(task, results[0], results[1], results[3].name, userId);
    });
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

function getNotificationsByProjectIds(projectIds, limit, timeStamp, callback) {
    var tasks = [];
    projectIds.forEach(function (id) {
        tasks.push(
            function (callback) {
                notificationRepo.findLimit({"subjectDescriptor.projectId": id, timeStamp: {"$lt" : timeStamp}}, limit, callback);
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
    var description = oldDeadline != undefined ? " has moved the deadline from " + oldDeadline.toISOString().slice(0, 10) + " to " + project.deadline.toISOString().slice(0, 10) + " on the " + project.name + " project" : " has set a deadline on the " + project.name + " project to " + project.deadline.toISOString().slice(0, 10);
    var notification = makeUpdateProjectNotification(makeSubjectDescriptor(project.leader._id, project._id), description);
    create(notification);
}

function createBoardNameNotification(oldname, board, projectName, userId) {
    var description = " has changed the name of the " + oldname + " board to " + board.name + " in the " + projectName + " project";
    var notification = makeUpdateBoardNotification(userId, board.projectId, board._id, description);
    create(notification);
}

function createBoardDescriptionNotification(projectName, board, userId) {
    var description = " has changed the description of the " + board.name + " board in the " + projectName + " project.";
    var notification = makeUpdateBoardNotification(userId, board.projectId, board._id, description);
    create(notification);
}

function createBoardDeadlineNotification(oldDeadline, board, projectName, userId) {
    var description = oldDeadline != undefined ? " has moved the deadline from " + oldDeadline.toISOString().slice(0, 10) + " to " + board.deadline.toISOString().slice(0, 10) + " on the " + board.name + " board in the " + projectName + "project" : " has set a deadline on the " + board.name + " board to " + project.deadline.toISOString().slice(0, 10) + " in the " + projectName + " project";
    var notification = makeUpdateBoardNotification(userId, board.projectId, board._id, description);
    create(notification);
}

function createTaskTitleNotification(oldname, task, projectName, boardName, userId) {
    var description = " has changed the name of the " + oldname + " task to " + task.title + " on the " + boardName + " board in the " + projectName + " project.";
    var notification = makeUpdateTaskNotification(userId, task.projectId, task.boardId, task._id, description);
    create(notification);
}

function createTaskDescriptionNotification(task, projectName, boardName, userId) {
    var description = " has changed the description of the " + task.identifier + " task on the " + boardName + " board in the " + projectName + " project.";
    var notification = makeUpdateTaskNotification(userId, task.projectId, task.boardId, task._id, description);
    create(notification);
}

function createTaskImportantNotification(task, projectName, boardName, userid) {
    var description = task.important ? " has flagged the " + task.identifier + " task as important" : " has flagged the " + task.identifier + " task as unimportant";
    description += " on the " + boardName + " board in the " + projectName + " project.";
    var notification = makeUpdateTaskNotification(userid, task.projectId, task.boardId, task._id, description);
    create(notification);
}

function createTaskDeadlineNotification(oldDeadline, task, projectName, boardName, userId) {
    var description = oldDeadline != undefined ? " has moved the deadline from " + oldDeadline.toISOString().slice(0, 10) + " to " + task.deadline.toISOString().slice(0, 10) + " on the " + boardName + " board in the " + projectName + " project. " : " has set a deadline on the " + boardName + " board in the " + projectName + " project to " + task.deadline.toISOString().slice(0, 10);
    var notification = makeUpdateTaskNotification(userId, task.projectId, task.boardId, task._id, description);
    create(notification);
}

function createTaskAssigneeNotification(task, projectName, boardName) {
    var description = " has been assigned to the " + task.identifier + " task on the " + boardName + " board in the " + projectName + " project.";
    var notification = makeUpdateTaskNotification(task.assignee._id, task.projectId, task.boardId, task._id, description);
    create(notification);
}

function createTaskStateNotification(oldState, task, projectName, boardName, userId) {
    var description = " has changed the state of the " + task.identifier + " task from " + oldState + " to " + task.state + " on the " + boardName + " board in the " + projectName + " project."
    var notification = makeUpdateTaskNotification(userId, task.projectId, task.boardId, task._id, description);
    create(notification);
}

function createTaskChangeBoardNotification(task, oldBoard, newBoard, projectName, userId) {
    var description = " has moved the " + task.identifier + " task from the " + oldBoard.name + " board to the " + newBoard.name + "board in the " + projectName + " project.";
    var notifications = [];
    notifications.push(makeUpdateTaskNotification(userId, task.projectId, oldBoard._id, task._id, description));
    notifications.push(makeUpdateTaskNotification(userId, task.projectId, newBoard._id, task._id, description));
    addNotifications(notifications);
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

function makeCreateBoardNotification(userId, projectId, boardId, description) {
    return makeNotification(makeSubjectDescriptor(userId, projectId, boardId), description, "CREATE", "BOARD");
}

function makeUpdateBoardNotification(userId, projectId, boardId, description) {
    return makeNotification(makeSubjectDescriptor(userId, projectId, boardId), description, "UPDATE", "BOARD");
}

function makeCreateTaskNotification(userId, projectId, boardId, taskId, description) {
    return makeNotification(makeSubjectDescriptor(userId, projectId, boardId, taskId), description, "CREATE", "TASK");
}

function makeUpdateTaskNotification(userId, projectId, boardId, taskId, desciption) {
    return makeNotification(makeSubjectDescriptor(userId, projectId, boardId, taskId), desciption, "UPDATE", "TASK");
}

function create(notification) {
    notificationRepo.create(notification)
}
