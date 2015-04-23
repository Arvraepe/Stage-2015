/**
 * Created by Glenn on 13-4-2015.
 */

exports.validateNewProject = function(project) {
    var messages =  validateProjectOrBoard(project);
    if(!checkCode(project.code)) {
        messages.push(makeMessage('Code', 2, 8));
    }
    return messages;
};

exports.validateBoard = function(board) {
    return validateProjectOrBoard(board);
};

function validateProjectOrBoard(params) {
    var messages = [];
    params.standardStates = params.standardStates || params.states;
    if(!checkName(params.name)) {
        messages.push(makeMessage('name', 2, 75));
    }
    if(!checkDesc(params.description)) {
        messages.push(makeMessage('description', 5, 1000));
    }
    if(params.deadline != undefined) {
        var dateDeadline = new Date(params.deadline);
        if (!checkDeadline(dateDeadline)) {
            messages.push({code: 'ERROR', message: "Deadline can't already be expired."});
        }
    }
    if(!checkStates(params.standardStates)) {
        messages.push(makeMessage('state', 2, 20));
    }
    return messages;}

function checkName(name) {
    return name.length > 2 && name.length < 75;
}

function checkCode(code) {
    return code.length > 2 && code.length < 8;
}

function checkDesc(desc) {
    return desc.length > 5 && desc.length < 1000;
}

function checkDeadline(date) {
    return date === undefined || date > new Date();
}

function checkStates(states) {
    var res = true;
    states.forEach(function (entry) {
        if(entry.length < 2 || entry.length > 20) {
            res = false;
        }
    });
    return res;
}

function makeMessage(wrong, minlength, maxlength) {
    return { code : 'ERROR', message : wrong + 'needs to be between ' + minlength + ' and ' + maxlength + 'characters long.'};
}

function convertStates(states) {
    var result = [];
    states.forEach(function (entry) {
        result.push(entry);
    });
    return result
}