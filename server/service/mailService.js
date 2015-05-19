/**
 * Created by Glenn on 8-4-2015.
 */
var nodemailer = require('nodemailer');
var config = require('./../config.json');
var async = require('async');

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email,
        pass: config.password
    }
});

exports.sendRecoveryMail = function (to, link, cb) {
    var text = "<p>We've received a request to reset your collaboration account password.</p>" +

        "<p>To change your password, please click this link:</p>" +

        "<p>" + link + "</p>"+

        "<p>Password reset links are valid for only 24 hours. If the link expires, you will need to submit a new request.</p>" +

        "<p>If you didn't request a change, please disregard this e-mail and your password will stay the same.</p>";
    var html =


            //'<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable">'+
            //    '<tr>'+
            //        '<td align="center" valign="top">'+
            //            '<table border="0" cellpadding="10" cellspacing="0" width="600" id="templatePreheader">' +
            //                '<tr>' +
            //                    '<td valign="top" class="preheaderContent">'+
            //                        '<table border="0" cellpadding="10" cellspacing="0" width="100%">'+
            //                            '<tr>'+
            //                                '<td valign="top">'+
            //                                    '<div mc:edit="std_preheader_content">'+
            //                                        'Use this area to offer a short teaser of your email\'s content. Text here will show in the preview area of some email clients.'+
            //                                    '</div>'+
            //                                '</td>'+
            //                                '<td valign="top" width="190">'+
            //                                    '<div mc:edit="std_preheader_links">'+
            //                                        'Is this email not displaying correctly?<br /><a href="*|ARCHIVE|*" target="_blank">View it in your browser</a>.'+
            //                                    '</div>'+
            //                                '</td>'+
            //                                '<!-- *|END:IF|* -->'+
            //                            '</tr>'+
            //                        '</table>'+
            //                        '<!-- // End Module: Standard Preheader \ -->'+
            //                    '</td>'+
            //                '</tr>'+
            //            '</table>'+
            //            '<!-- // End Template Preheader \\ -->'+
            //            '<table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer">'+
            //                '<tr>'+
            //                    '<td align="center" valign="top">'+
            //                        '<!-- // Begin Template Header \\ -->'+
            //                        '<table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader">'+
            //                            '<tr>'+
            //                                '<td class="headerContent">'+
            //                                    '<!-- // Begin Module: Standard Header Image \\ -->'+
            //                                    '<img src="http://gallery.mailchimp.com/653153ae841fd11de66ad181a/images/placeholder_600.gif" style="max-width:600px;" id="headerImage campaign-icon" mc:label="header_image" mc:edit="header_image" mc:allowdesigner mc:allowtext />'+
            //                                    '<!-- // End Module: Standard Header Image \\ -->'+
            //                                '</td>'+
            //                            '</tr>'+
            //                        '</table>'+
            //                        '<!-- // End Template Header \\ -->'+
            //                    '</td>'+
            //                '</tr>'+
            //                '<tr>'+
            //                    '<td align="center" valign="top">'+
            //                        '<!-- // Begin Template Body \\ -->'+
            //                        '<table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody">'+
            //                            '<tr>'+
            //                                '<td valign="top" class="bodyContent">'+
            //                                    '<!-- // Begin Module: Standard Content \\ -->'+
            //                                    '<table border="0" cellpadding="20" cellspacing="0" width="100%">'+
            //                                        '<tr>'+
            //                                            '<td valign="top">'+
            //                                                '<div mc:edit="std_content00">'+
            //                                                    '<h1 class="h1">Heading 1</h1>'+
            //                                                    '<strong>Getting started:</strong> Customize your template by clicking on the style editor tabs up above. Set your fonts, colors, and styles. After setting your styling is all done you can click here in this area, delete the text, and start adding your own awesome content!'+
            //                                                    '<br />'+
            //                                                    '<br />'+
            //                                                    'After you enter your content, highlight the text you want to style and select the options you set in the style editor in the "styles" drop down box. Want to <a href="http://www.mailchimp.com/kb/article/im-using-the-style-designer-and-i-cant-get-my-formatting-to-change" target="_blank">get rid of styling on a bit of text</a>, but having trouble doing it? Just use the "remove formatting" button to strip the text of any formatting and reset your style.'+
            //                                                '</div>'+
            //                                            '</td>'+
            //                                        '</tr>'+
            //                                    '</table>'+
            //                                    '<!-- // End Module: Standard Content \\ -->'+
            //                                '</td>'+
            //                            '</tr>'+
            //                        '</table>'+
            //                        '<!-- // End Template Body \\ -->'+
            //                    '</td>'+
            //                '</tr>'+
            //                '<tr>'+
            //                    '<td align="center" valign="top">'+
            //                    '<!-- // Begin Template Footer \\ -->'+
            //                        '<table border="0" cellpadding="10" cellspacing="0" width="600" id="templateFooter">'+
            //                            '<tr>'+
            //                                '<td valign="top" class="footerContent">'+
            //                                    '<!-- // Begin Module: Standard Footer \\ -->'+
            //                                    '<table border="0" cellpadding="10" cellspacing="0" width="100%">'+
            //                                        '<tr>'+
            //                                            '<td colspan="2" valign="middle" id="social">'+
            //                                                '<div mc:edit="std_social">'+
            //                                                '&nbsp;<a href="*|TWITTER:PROFILEURL|*">follow on Twitter</a> | <a href="*|FACEBOOK:PROFILEURL|*">friend on Facebook</a> | <a href="*|FORWARD|*">forward to a friend</a>&nbsp;'+
            //                                                '</div>'+
            //                                            '</td>'+
            //                                        '</tr>'+
            //                                        '<tr>'+
            //                                            '<td valign="top" width="350">'+
            //                                                '<div mc:edit="std_footer">'+
            //                                                    '<em>Copyright &copy; *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em>'+
            //                                                    '<br />'+
            //                                                    '*|IFNOT:ARCHIVE_PAGE|* *|LIST:DESCRIPTION|*'+
            //                                                    '<br />'+
            //                                                    '<strong>Our mailing address is:</strong>'+
            //                                                    '<br />'+
            //                                                    '*|HTML:LIST_ADDRESS_HTML|**|END:IF|*'+
            //                                                '</div>'+
            //                                            '</td>'+
            //                                            '<td valign="top" width="190" id="monkeyRewards">'+
            //                                                '<div mc:edit="monkeyrewards">'+
            //                                                    '*|IF:REWARDS|* *|HTML:REWARDS|* *|END:IF|*'+
            //                                                '</div>'+
            //                                            '</td>'+
            //                                        '</tr>'+
            //                                        '<tr>'+
            //                                            '<td colspan="2" valign="middle" id="utility">'+
            //                                                '<div mc:edit="std_utility">'+
            //                                                    '&nbsp;<a href="*|UNSUB|*">unsubscribe from this list</a> | <a href="*|UPDATE_PROFILE|*">update subscription preferences</a>&nbsp;'+
            //                                                '</div>'+
            //                                            '</td>'+
            //                                        '</tr>'+
            //                                    '</table>'+
            //                                    '<!-- // End Module: Standard Footer \\ -->'+
            //                                '</td>'+
            //                            '</tr>'+
            //                        '</table>'+
            //                        '<!-- // End Template Footer \\ -->'+
            //                    '</td>'+
            //                '</tr>'+
            //            '</table>'+
            //            '<br />'+
            //        '</td>'+
            //    '</tr>'+
            //'</table>'+
        '</div>';
    var mailOptions = makeMailOptions('noreply@collab.be', to, 'Password recovery', text);
    transport.sendMail(mailOptions, function (err, info) {
        if (err) cb(err);
        cb(null, info);
    });
};

exports.inviteCoworkers = function (to, link, cb) {
    var text = "A coworker has invited you to join our project!\n\n" +

        "Please use the link below to register a new account.\n\n" +

        link +

        "\n\nIn the collaboration app you can work together on projects with your friends or coworkers.\n\n" +

        "You can also create and manage your own projects for free! Start collaborating now.";
    var html =
        '<div style="text-align: center; width: 300px; height: 600px; font-family: Helvetica Neue, Helvetica, Arial, sans-serift; border: solid 2px #E7E7E7;">'+
            '<h1> HIVE5 </h1>'+
            '<p><h3>HIVE5 will help you manage your projects!</h3></p>'+
            '<p>A coworker has invited you to join!</p>'+
            '<p>In the collaboration app you can work together on projects with your friends or coworkers.</p>'+
            '<p>You can also create and manage your own projects for free! Start collaborating now.</p>'+
            '<a href="' + link + '"><button>Click here</button></a>'+
        '</div>';
    var mailOptions = makeMailOptions('noreply@collab.be', to, 'Join the team!', html);
    transport.sendMail(mailOptions, cb);

};

function makeMailOptions(from, to, subject, text) {
    return {from: from, to: to, subject: subject, html: text};
}
