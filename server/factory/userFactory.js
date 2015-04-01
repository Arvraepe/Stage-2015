/**
 * Created by Glenn on 1-4-2015.
 */
exports.makeUserResult = function makeUserResult(username, email, _id, firstname, lastname, cb) {
    makeUserResultsPrivate(username, email, _id, firstname, lastname, cb);
};

exports.makeUserLoginResult = function(username, email, _id, firstname, lastname, cb) {
    makeUserResultsPrivate(username, email, _id, firstname, lastname,  function (result) {
        result.sessionid = 5; //todo actually manage sessionids
        result.user.role = 'user';
    })
};

function makeUserResultsPrivate(username, email, _id, firstname, lastname, cb) {
    var result =
    {
        'user': {
            'username': username,
            'email': email,
            '_id': _id,
            'firstname': firstname,
            'lastname': lastname
        }
    };
    cb(result);
}
