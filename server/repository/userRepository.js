/**
 * Created by Glenn on 31-3-2015.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AgCollab');

var db = mongoose.connection;
db.on('error', function (err) {
});
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    salt: String,
    firstname: String,
    lastname: String,
    imageExtension: String,
    recovery: {
        uuid: String,
        date: Date
    }
});
var User = mongoose.model('User', userSchema);

exports.registerUser = function (user, callback) {
    var registeredUser = new User({
        username: user.username,
        password: user.password,
        salt: user.salt,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        recovery: {}
    });
    registeredUser.save(function (err, registeredUser) {
        if (err) {
            callback(err);
        } else {
            callback(null, true);
        }
    });
};

exports.emailExists = function(email, cb) {
    User.find({email: email}, function(err, users) {
        if(err) cb(err);
        cb(null, users.length >= 1);
    })
};

exports.userExists = function (condition, cb) {
    User.find(condition, function (err, users) {
        if (err) cb(err);
        cb(null, users.length >= 1);
    });
};

exports.findUser = function(username, cb) {
    User.findOne({username: username}).lean().exec(function(err, user) {
        if(err) cb(err);
        cb(null, user);
    });
};

exports.findUserById = function(id, cb) {
    User.findOne({_id: id}).lean().exec(function(err, user) {
        if(err) cb(err);
        cb(null, user);
    });
};

exports.findOneAndUpdate = function(id, update, cb) {
    User.findOneAndUpdate({_id: id}, update, {new: true}).lean().exec(function (err, user) {
        if(err) cb(err);
        if(user == null) {
            cb(new Error('No such User'));
        }
        cb(null, user);
    });
};

//exports.getUsers = function(cb) {
//    User.find().lean().exec(function (err, users) {
//        if(err) cb(err);
//        cb(null, users);
//    })
//};

exports.findUserByEmail = function(email, cb) {
    User.findOne({email : email}).lean().exec(function (err, user) {
        if(err) cb(err);
        if(user == null) {
            cb(new Error('There is no user registered with that email'));
        } else {
            cb(null, user);
        }
    });
};

exports.findUserByUuid = function(uuid, cb) {
    User.findOne({'recovery.uuid': uuid}).exec(function(err, user) {
        if(err) cb(err);
        if(user != null && user.recovery.date > new Date()) {
            user.recovery = undefined;
            user.save(function(err, user) {
                if(err) cb(err);
                cb(null, user);
            });
        } else {
            cb(new Error('you clicked an invalid link'))
        }
    })
};