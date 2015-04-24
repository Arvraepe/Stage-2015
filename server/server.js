/**
 * Created by Glenn on 30-3-2015.
 */


var restify = require('restify');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AgCollab');
userSchema = require('./models/user').User;
boardSchema = require('./models/board').Board;
taskSchema = require('./models/task').Task;
projectSchema = require('./models/project').Project;
mongoose.model('Board', boardSchema);
mongoose.model('User', userSchema);
mongoose.model('Project', projectSchema);
mongoose.model('Task', taskSchema);

var app = restify.createServer();
var userRoutes = require('./routes/userRoutes');
var projectRoutes = require('./routes/projectRoutes');
var boardRoutes = require('./routes/boardRoutes');

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.get(/.avatars/, restify.serveStatic({
directory: 'public',
 default: 'profilepicture.jpg'
}));


userRoutes.registerRoutes(app);
projectRoutes.registerRoutes(app);
boardRoutes.registerRoutes(app);

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