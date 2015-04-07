/**
 * Created by Glenn on 30-3-2015.
 */


var restify = require('restify');
var app = restify.createServer();
var userRoutes = require('./routes/UserRoutes');
var multiparty = require('connect-multiparty');

app.use(multiparty({
    uploadDir: './uploads'
}));
app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

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