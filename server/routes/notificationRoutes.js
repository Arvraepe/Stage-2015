/**
 * Created by Glenn on 8-5-2015.
 */
var auth = require('./../service/authenticationService');
var notificationService = require('./../service/notificationService');
var errorHandler = require('./../response/errorHandler');

exports.registerRotes = function(app) {
    app.get('/notifications/user',getUserFromToken, getNotificationsByUser);
};

function getUserFromToken(req, res, next) {
    auth.verifyToken(req.params.token, function(err, userId) {
        req.userId = userId;
        next(err);
    })
}

function getNotificationsByUser(req, res, next) {
    notificationService.getNotificationsByUserId(req.userId, function(err, result) {
        res.send(errorHandler.handleResult(err, {notifications: result}, 'notifications fetched'));
    });
}