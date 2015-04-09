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
    var text = "We've received a request to reset your collaboration account password.\n\n" +

        "To change your password, please click this link:\n\n" +

        link + "\n\n" +

        "Password reset links are valid for only 24 hours. If the link expires, you will need to submit a new request.\n\n" +

        "If you didn't request a change, please disregard this e-mail and your password will stay the same.";

    var mailOptions = makeMailOptions('noreply@collab.be', to, 'Password recovery', text)
    transport.sendMail(mailOptions, function(err, info) {
        if(err) cb(err);
        cb(null, info);
    });
};

exports.inviteCoworkers = function(to, link, cb) {
    var text = "A coworker has invited you to join his project!\n\n" +

        "Please use the link below to register a new account.\n\n" +

        link + "\n\n" +

        "In the collaboration app you can work together on projects with your friends or coworkers.\n\n" +

        "You can also create and manage your own projects for free! Start collaborating now.";
    var mailOptions = makeMailOptions('noreply@collab.be', to, 'Join the team!', text);
    transport.sendMail(mailOptions, function(err, info) {
        if(err) cb(err);
        cb(null, info);
    });
};

function makeMailOptions(from, to, subject, text) {
    return { from: from, to: to, subject: subject, text: text };
}