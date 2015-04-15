/**
 * Created by Glenn on 14-4-2015.
 */
var resultFact = require('./resultFactory');

exports.handleProjectErrors = function (err, results) {
    var result;
    var usersAddedCounter = 0, emailsSentCounter = 0;
    var messages = [];
    if(err) {
        result = resultFact.makeFailureResult('ERROR', err.message);
    } else {
        results.forEach(function (entry) {
            console.log(entry._id);
            if (entry._id !== undefined) { //this is a project with 1 user added, the last iteration we come here will have the project with all users added.
                usersAddedCounter++;
            } else if (entry.code !== undefined || entry.code !== null) {//this is a user not found
                messages.push(entry);
            } else {//this is an email
                emailsSentCounter++;
            }
        });
        var message;
        if(emailsSentCounter !== 0) {
            message = emailsSentCounter==1 ? ' invitation email has been sent.' : ' invitation emails have been sent.';
            messages.push({code: 'INFO', message:emailsSentCounter + message})
        }
        if(usersAddedCounter !== 0) {
            message = usersAddedCounter==1 ? ' user has been added to your project!' : ' users have been added to your project!';
            messages.push({code: 'INFO', message: usersAddedCounter + message})
        }
        result = resultFact.makeSuccessMMResult(messages);
    }
    return result;
};