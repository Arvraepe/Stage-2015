/**
 * Created by Glenn on 8-4-2015.
 */
exports.makeSuccessResult = function (message, data) {//success, code, message, data) {
    var conf = {};
    conf.success = true;
    message = message || '';
    if (message.length > 2) {
        conf.messages = [{
            code: 'INFO',
            message: message
        }];
    }
    conf.data = data || {};
    return conf;
};

exports.makeFailureResult = function (code, message) {
    var conf = {};
    conf.success = false;
    conf.messages = [{
        code: code,
        message: message
    }];
    return conf;
};

exports.makeFailureMultipleMessages = function (messages) {
    var conf = {};
    conf.success = false;
    conf.messages = messages;
    return conf;
};

exports.makeUserResult = function (user) {
    var userResult = {};
    userResult.user = user;
    userResult.user.role = 'user';
    return userResult;
};
