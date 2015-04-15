/**
 * Created by Glenn on 30-3-2015.
 */


var restify = require('restify');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AgCollab');
userSchema = require('./models/user').User;
mongoose.model('User', userSchema);
projectSchema = require('./models/project').Project;
mongoose.model('Project', projectSchema);

var app = restify.createServer();
var userRoutes = require('./routes/userRoutes');
var projectRoutes = require('./routes/projectRoutes');

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.get(/.avatars/, restify.serveStatic({
directory: 'public',
 default: 'profilepicture.jpg'
}));


userRoutes.registerRoutes(app);
projectRoutes.registerRoutes(app);
app.listen(6543, function() {
    console.log('%s listening at %s', app.name, app.url);
});
/*
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
userRoutes.registerRoutes(app);
    **/