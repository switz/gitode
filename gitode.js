/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	file = require('./routes/file'),
	repository = require('./routes/repository'),
	mongoose = require('mongoose'),
	pushover = require('pushover'),
	// Repositories
	repos = pushover(__dirname + '/repositories'),
	// Create Server
	app = module.exports = express.createServer();


mongoose.connect('mongodb://localhost/gitode');

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

repos.on('push', function (repo) {
	console.log('push to', repo);
});

// Index
//app.get('/', routes.index);

// Repositories
app.get('/repository', repository.GET);
app.get('/repository/:slug', repository.oneGET);
app.put('/repository/:slug', repository.idPUT);
app.post('/repository/new', repository.POST);

// User
app.get('/user/login', user.login);
app.post('/user/login', user.loginPOST);
app.get('/user/signup', user.signup);
app.post('/user/signup', user.signupPOST);
app.get('/user/logout', user.logout);

// File Browser
app.get(/\/repository\/([a-z\-]*)\/([0-9a-f]{5,40}|HEAD)\/(.+\.[^.]+)$/, file.file);
app.get(/\/repository\/([a-z\-]*)\/([0-9a-f]{5,40}|HEAD)\/(.*\/?|.{0})$/, file.folder);
app.put(/\/repository\/([a-z\-]*)\/([0-9a-f]{5,40}|HEAD)\/(.+\.[^.]+)$/, file.filePUT);
app.put(/\/repository\/([a-z\-]*)\/([0-9a-f]{5,40}|HEAD)\/(.*\/?|.{0})$/, file.folderPUT);
app.get('/folder/:repo/:path', file.folder);

// Run Repo Listener [gets forwarded to app.listen()]
repos.listen(7000);

app.listen(4000);