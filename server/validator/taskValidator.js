/**
 * Created by Glenn on 24-4-2015.
 */

exports.validateNewTask = function(task, boardDeadline) {
    var messages = [];
    if(!validateString(task.title, 2, 40)) {
        messages.push(makeMessage('title', 2, 40));
    }
    if(!validateString(task.description, 2, 1000)) {
        messages.push(makeMessage('description', 2, 1000));
    }
    if(!task.important instanceof Boolean) {
        messages.push({code : 'ERROR', message:'Important needs to be a true or false value.'})
    }
    if(!validateDate(task.deadline, boardDeadline)){
        messages.push({ code: 'ERROR', message: 'The deadline cannot be later than the board\'s deadline (' + boardDeadline + '), it also needs to be later than today.' });
    }
    return messages;
};

function validateString(string, minLength, maxLength){
    return string.length >= minLength && string.length <= maxLength;
}

function validateDate(taskDeadline, boardDeadline) {
    taskDeadline = new Date(taskDeadline);
    if(taskDeadline instanceof Date) return true;
    else if(boardDeadline == undefined) return taskDeadline > new Date();
    else return taskDeadline <= boardDeadline && taskDeadline > new Date();
}

function makeMessage(wrong, minlength, maxlength) {
    return { code : 'ERROR', message : wrong + ' needs to be between ' + minlength + ' and ' + maxlength + 'characters long.'};
}