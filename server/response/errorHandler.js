/**
 * Created by Glenn on 14-4-2015.
 */
var resultFact = require('./resultFactory');

exports.handleProjectErrors = function (err, messages, project) {
    var result;
    if(err) {
        result = resultFact.makeFailureResult('ERROR', err.message);
    } else if(messages) {
        result = resultFact.makeFailureMultipleMessages(messages);
    } else {
        result = resultFact.makeSuccessResult('A new project was created.', {project : project});
    }
    return result;
}