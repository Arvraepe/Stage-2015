/**
 * Created by Glenn on 3-4-2015.
 */
var jwt = require('jsonwebtoken');

exports.issueToken = function(payload) {
    var token = jwt.sign(payload, 'secret');
    return token;
};

exports.verifyToken = function(token, verified) {
    return jwt.verify(token, 'secret', verified);
};