/**
 * Created by Glenn on 1-4-2015.
 */
var _ = require('underscore');

function makeResult(config) {//success, messages, data) {
    return { 'success' : config.success, 'messages' : config.messages, 'data' : config.data };
}

exports.makeResult = function(config) {//success, code, message, data) {
    console.log(config);
    config.messages = config.messages || {};
    return makeResult(config);
};

exports.makeUserResult = function makeUserResult(user) {
    var userResult = {};
    return userResult.user = _.omit(user, ['password', 'salt']);
};

exports.makeUserLoginResult = function(user) {
    var result = {};
    result.user = _.omit(user, ['password', 'salt']);
    result.sessionid = 5; //todo actually manage sessionids
    result.user.role = 'user';
    return result;
};