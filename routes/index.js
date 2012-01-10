/**
 * GET: Home Page
 * 
 */

var pushover = require('pushover'),
	repos = pushover(__dirname + '/../repositories');

exports.index = function(req, res) {
	repos.list(function(err, list) {
		res.render('index', {
			title: 'Express',
			repos: list
		})
	})
}