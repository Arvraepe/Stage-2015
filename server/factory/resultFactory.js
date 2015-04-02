/**
 * Created by Glenn on 1-4-2015.
 */
function makeResult(success, messages, data) {
    return { 'success' : success, 'messages' : messages, 'data' : data };
}

function makeMessages(code, message) {
    return  {'code' : code, 'message' : message};

}

exports.makeResult = function(success, code, message, data) {
    var messages = makeMessages(code, message);
    return makeResult(success, messages, data);
};

exports.makeResultNoMessage = function(success, data) {
    return makeResult(success, [], data);
};

exports.makeUserResult = function makeUserResult(user) {
    return makeUserResultsPrivate(user.username, user.email, user._id, user.firstname, user.lastname);
};

exports.makeUserLoginResult = function(user) {
    var result = makeUserResultsPrivate(user.username, user.email, user._id, user.firstname, user.lastname);
    result.sessionid = 5; //todo actually manage sessionids
    result.user.role = 'user';
    return result;
};

function makeUserResultsPrivate(username, email, _id, firstname, lastname) {
    return { 'user': { 'username': username, 'email': email, '_id': _id, 'firstname': firstname, 'lastname': lastname } };
}