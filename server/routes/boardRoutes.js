/**
 * Created by Glenn on 21-4-2015.
 */
var auth = require('./../service/authenticationService');
var projectService = require('./../service/projectService');
var errorHandler = require('./../response/errorHandler');

ezports.registerRoutes = function(app) {
    app.post('/board/create', createBoard)
};

function createBoard(req, res, next) {
    async.waterfall([
        function(callback) {
            auth.verifyToken(req.params.token, callback)
        },
        function (userId, callback) {
            projectService.getProject(req.params.projectId, userId, function(err, project) {
                callback(err, project, userId);
            })
        },
        function (project, userId, callback) {
            if(project.leader != userId) callback(new Error('You are not the leader of this project, you cannot create boards.'));
            else boardService.createBoard(req.params, function(err, result, messages) {
                var results = { result : result, messages : messages };
                callback(err, results)
            });
        }
    ], function(err, result){
        result = errorHandler.handleMMResult(err, result.result, result.messages, 'A new board was created for your project.');
        res.send(result);
    });
}

