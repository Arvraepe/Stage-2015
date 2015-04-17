/**
 * Created by Glenn on 14-4-2015.
 */
var resultFact = require('./resultFactory');

exports.handleProjectErrors = function (err, results) {
    var result;
    var usersAddedCounter = 0, emailsSentCounter = 0;
    var messages = [];
    var project = {};
    if(err) {
        result = resultFact.makeFailureResult('ERROR', err.message);
    } else {
        results.forEach(function (entry) {
            if (entry.add !== undefined) { //this means 1 user was added to the project.
                usersAddedCounter++;
            } else if (entry.message !== undefined ) {//this is a user not found
                messages.push(entry.message);
            } else if (entry.description !== undefined) {
                project = entry;
            } else {//this is an email
                emailsSentCounter++;
            }
        });
        var message;
        if(emailsSentCounter !== 0) {
            message = emailsSentCounter==1 ? 'Your project has ' + emailsSentCounter + ' collaborator': 'Your project has ' + emailsSentCounter + ' collaborators';
            messages.push({code: 'INFO', message: message})
        }
        if(usersAddedCounter !== 0) {
            message = usersAddedCounter==1 ? '' : ' users have been added to your project!';
            messages.push({code: 'INFO', message: usersAddedCounter + message})
        }
        result = resultFact.makeSuccessMMResult(messages, {project : project});
    }
    return result;
};

exports.handleResult = function(err, result, message) {
    if(err) {
        result = resultFact.makeFailureResult('ERROR', err.message);
    } else {
        result = resultFact.makeSuccessResult(message, result);
    }
    return result;
};