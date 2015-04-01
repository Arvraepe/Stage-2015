/**
 * Created by Glenn on 1-4-2015.
 */
var characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
exports.getSalt = function getSalt(password, salt,  callback) {
    if ((password + salt).length >= 256) {
        callback(salt);
        return;
    }
    salt += characters.charAt(Math.floor(Math.random() * characters.length))
    getSalt(password, salt, callback)
};
