/**
 * Created by Glenn on 8-4-2015.
 */
var nodemailer = require('nodemailer');
var config = require('./../config.json');

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth : {
        user : config.email,
        pass : config.password
    }
});

exports.sendRecoveryMail = function (to, link, cb) {
    var mailOptions = {
        from: 'noreply@collab.be',
        to: to,
        subject: 'Password recovery',
        text: "We've received a request to reset your collaboration account password.\n\n" +

        "To change your password, please click this link:\n\n" +

        link + "\n\n" +

        "Password reset links are valid for only 24 hours. If the link expires, you will need to submit a new request.\n\n" +

        "If you didn't request a change, please disregard this e-mail and your password will stay the same."
    };
    transport.sendMail(mailOptions, function(err, info) {
        if(err) cb(err);
        cb(null, info);
    });
};