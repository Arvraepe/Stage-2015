/**
 * Created by Glenn on 8-4-2015.
 */
exports.validateRegistration = function(user) {
    var messages = [];
    if(!validateEmail(user.email)) {
        messages.push(createMessage('email'));
    }
    messages = validateName(user.firstname, user.lastname, messages);
    if(!validateUserName(user.username)) {
        messages.push(createMessage('username'));
    }
    if(!validatePassword(user.password)) {
        messages.push(createMessage('password'));
    }
    return messages;
};

exports.validateUpdate = function(params) {
    return validateName(params.firstname, params.lastname)
};

exports.validateChangedPassword = function(password) {
    return validatePassword(password);
};

function validateName(firstname, lastname, messages) {
    messages = messages || {};
    if(!validateFirstname(firstname)) {
        messages.push(createMessage('first name'));
    }
    if(!validateLastName(lastname)) {
        messages.push(createMessage('last name'));
    }
    return messages;
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validateUserName(username) {
    return username.length > 2 && username.length < 16;
}

function validateFirstname(firstName) {
    var re = /^[a-z ,.'-]+$/i;
    return re.test(firstName) && firstName.length > 2 && firstName.length < 25;
}

function validateLastName(lastName) {
    var re = /^[a-z ,.'-]+$/i;
    return re.test(lastName) && lastName.length > 2 && lastName.length < 75;
}

function validatePassword(password) {
    var re = /^[a-zA-Z]\w{7,20}$/;
    return re.test(password);
}

function createMessage(str) {
    return {code: 'ERROR', message: 'provided ' + str + ' was incorrect'};
}