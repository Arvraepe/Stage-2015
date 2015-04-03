/**
 * Created by Glenn on 30-3-2015.
 */


var restify = require('restify');
var app = restify.createServer();
var userRoutes = require('./routes/UserRoutes');
var multer = require('multer');

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());
app.use(multer({
    dest: './uploads/',
    rename: function(fieldname, filename) {
        return filename.replace(/\w+/g, '-').toLowerCase() + Date.now();
    }
}));
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