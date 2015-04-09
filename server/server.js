/**
 * Created by Glenn on 30-3-2015.
 */


var restify = require('restify');
var app = restify.createServer();
var userRoutes = require('./routes/UserRoutes');

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());
/*
 app.get(/\/docs\/public\/?.*//*
 , restify.serveStatic({
    directory: __dirname
}));
 */

/*
 app.get(/\/uploads\/?.*//*
 , restify.serveStatic({
 directory: './uploads'

 }));
 */

/*app.get(/.*//*, restify.serveStatic({
 directory: __dirname+'\\uploads',
 default: 'zoompie.jpg'
 }));*/


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