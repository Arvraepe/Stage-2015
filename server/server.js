/**
 * Created by Glenn on 30-3-2015.
 */


var restify = require('restify');
var app = restify.createServer();
app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());
var userRoutes = require('./routes/UserRoutes');

userRoutes.registerRoutes(app);
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