/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	cogs = require('./cogs/cog'),
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

repos.on('push', cogs.push);

// Index
app.get('/', routes.index);
// User

app.get('/user/login', user.login);
app.post('/user/login', user.loginPOST);

app.get('/user/signup', user.signup);
app.post('/user/signup', user.signupPOST);

app.get('/user/logout', user.logout);

// Run Repo Listener [gets forwarded to app.listen()]
repos.listen(7000);

app.listen(3000);