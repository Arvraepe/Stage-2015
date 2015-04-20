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
        console.log(results);
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
            message = emailsSentCounter==1 ? ' email has been sent.': ' emails have been sent.';
            messages.push({code: 'INFO', message: emailsSentCounter + message})
        }
        if(usersAddedCounter !== 0) {
            message = usersAddedCounter==1 ? 'Your project has ' + usersAddedCounter + ' collaborator' : ' Your project now has ' + usersAddedCounter + ' collaborators.';
            messages.push({code: 'INFO', message: message})
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