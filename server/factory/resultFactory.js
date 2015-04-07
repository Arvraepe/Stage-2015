/**
 * Created by Glenn on 1-4-2015.
 */

function makeResult(config) {//success, messages, data) {
    return { 'success' : config.success, 'messages' : config.messages, 'data' : config.data };
}

exports.makeResult = function(config) {//success, code, message, data) {
    config.messages = config.messages || {};
    config.data = config.data || {};
    return makeResult(config);
};

exports.makeUserResult = function makeUserResult(user) {
    var userResult = {};
    userResult.user = user;
    return userResult;
};

exports.makeUsersResult = function(users) {
    var usersResult = {};
    usersResult.users = users;
    return usersResult;
};

exports.makeUserLoginResult = function(user) {
    var result = {};
    result.user = user;
    result.user.role = 'user';
    return result;
};