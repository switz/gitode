var mongoose = require('mongoose'),
	pushover = require('pushover'),
	gits = require('gits');


//	repositoryModel = require('../models/repository');
RepositorySchema = new mongoose.Schema({
	name: String,
	user: String,
	project: String,
	description: String,
	slug: String,
	location: String,
	files: String,
	private: Boolean,
	lastPush: Date,
	created: Date,
	diskSize: Number,
	allowPullRequests: Boolean
})

var repositoryModel = mongoose.model('Repository', RepositorySchema),
	repositoriesDir = pushover(__dirname + '/../repositories');

exports.GET = function(req, res) {
	//res.setHeader('Access-Control-Allow-Origin', '*');
	return repositoryModel.find(req.params, function(err, repos) {
		if (!err) {
			return res.json(repos);
		}
	});
}

exports.oneGET = function(req, res) {
	//res.setHeader('Access-Control-Allow-Origin', '*');
	return repositoryModel.findOne({
		slug: req.params.slug
	}, function(err, repo) {
	});
}

exports.idPUT = function(req, res) {
	return repositoryModel.findById(req.params.id, function(err, repo) {
		repo.name = req.body.name;
		repo.user = req.body.user;
		repo.project = req.body.project;
		repo.location = req.body.slug;
		repo.location = req.body.location;
		repo.private = req.body.private;
		repo.lastPush = req.body.lastPush;
		repo.created = req.body.created;
		repo.diskSize = req.body.diskSize;
		repo.allowPullRequests = req.body.allowPullRequests;

		return repo.save(function(err) {
			if (!err) {
				console.log("Updated", repo.name, '(' + repo.location + ')');
			}
			return res.json(repo);
		});
	});
}

exports.POST = function(req, res) {
	var slug = req.body.name.toLowerCase().replace(/[^a-zA-Z0-9']+/g, '-').replace(/'|"|-$/g, '');
	console.log('req', slug);
	return repositoryModel.findOne({
		slug: slug
	}, function(err, repo) {
		console.log("slug", slug);
		if (repo) {
			res.json({
				error: "A repository with this name (or same slug) already exists."
			});
		}
		// If we already sent the response, just leave
		else {
			console.log('create');
			var repo = new repositoryModel({
				name: req.body.name,
				user: req.body.user,
				project: req.body.project,
				slug: slug,
				location: slug,
				public: req.body.private,
				lastPush: req.body.lastPush,
				created: new Date(),
				diskSize: req.body.diskSize,
				allowPullRequests: req.body.allowPullRequests
			});
			repo.save(function(repoError) {
				if (!repoError) {
					console.log("Created", req.body.name, '(' + slug + ')');
					repositoriesDir.create(slug, function(dirError) {
						if (!dirError) {
							return res.json({
								redirect: '#/repository/' + slug
							});
						}
					});
				} else {
					console.log("Error while trying to create", req.body.name, '(' + slug + ')');
					return res.json({
						error: req.body.name + ' could not be created.'
					});
				}
			});
		}
	});
}