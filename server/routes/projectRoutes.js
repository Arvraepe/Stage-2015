/**
 * Created by Glenn on 13-4-2015.
 */
var projectService = require('./../service/projectService');
var resultFact = require('./../response/resultFactory');

exports.registerRoutes = function(app) {
    app.post('/project/create', createProject);
};

function createProject(req, res, next) {
    projectService.createProject(req.params, function(err, messages, project) {
        var result;
        if(err) {
            result = resultFact.makeFailureResult('ERROR', err.message);
        } else if(messages) {
            result = resultFact.makeFailureMultipleMessages(messages);
        } else {
            result = resultFact.makeSuccessResult('A new project was created.', {project : project});
        }
        res.semd(result);
    });
    next();
}