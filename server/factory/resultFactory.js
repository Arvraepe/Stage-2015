/**
 * Created by Glenn on 1-4-2015.
 */
function makeResult(success, messages, data, cb) {
    var result =
    {
        'success' : success,
        'messages' : messages,
        'data' : data
    };
    cb(result);
}

function makeMessages(code, message, cb) {
    var result =
    {
        'code' : code,
        'message' : message
    };
    cb(result);
}

exports.makeResult = function(success, code, message, data, cb) {
    makeMessages(code, message, function(messages) {
        makeResult(success, messages, data, function(result) {
            cb(result);
        })
    });
};

exports.makeResultNoMessage = function(success, data, cb) {
    makeResult(success, [], data, function(result) {
        cb(result);
    })
};