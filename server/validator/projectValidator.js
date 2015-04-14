/**
 * Created by Glenn on 13-4-2015.
 */
exports.validateNewProject = function(params) {
    var messages = [];
    console.log(messages);
    if(!checkName(params.name)) {
        messages.push(makeMessage('name', 2, 75));
    }
    console.log(messages);
    if(!checkDesc(params.description)) {
        messages.push(makeMessage('description', 5, 1000));
    }
    console.log(messages);
    if(!checkDeadline(params.deadline)) {
        messages.push({code:'ERROR',message:"Deadline can't already be expired."});
    }
    console.log(messages);
    //if(checkStates(params.standardStates)) {
    //    messages.push(makeMessage('state', 2, 20));
    //}
    params.standardStates = ['todo', 'in progress', 'done'];
    return messages;
};

function checkName(name) {
    return name.length > 2 && name.length < 75;
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
        console.log(entry);
        if(entry.length < 2 || entry.length > 20) {
            res = false;
        }
    });
    return res;
}

function makeMessage(wrong, minlength, maxlength) {
    return { code : 'ERROR', message : wrong + 'needs to be between ' + minlength + ' and ' + maxlength + 'characters long.'};
}