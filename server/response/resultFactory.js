/**
 * Created by Glenn on 8-4-2015.
 */
exports.makeSuccessResult = function(message, data) {//success, code, message, data) {
    var conf = {};
    conf.success = true;
    conf.messages = [{
        code : 'INFO',
        message : message
    }];
    conf.data = data || {};
    return conf;
};

exports.makeFailureResult = function(code, message) {
    var conf = {};
    conf.success = false;
    conf.messages = [{
        code : code,
        message : message
    }];
    return conf;
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