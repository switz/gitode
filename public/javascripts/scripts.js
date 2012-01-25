var Gitode = {},
	localhost = 'http://localhost:4000';

Gitode.Models = {
	Repository: Backbone.Model.extend({
		defaults: {
			name: 'name',
			user: 'user',
			project: null,
			description: '',
			slug: 'slug',
			location: null,
			private: true,
			lastPush: 0,
			created: 0,
			diskSize: 0,
			allowPullRequests: false,
			_id: null
		},
		urlRoot: localhost+'/repository'
	}),
	Folder: Backbone.Model.extend({
		defaults: {
			Folders: [],
			Files: []
		},
		url: function(){ return "http://localhost:4000/repository/cis/HEAD/folder"; }
	}),
	File: Backbone.Model.extend({
		defaults: {
			Contents: 'contents',
			ModifiedDate: 0
		},
		url: function(){ return "http://localhost:4000/repository/cis/HEAD/hw1.hs"; }
	})
}

Gitode.Collections = {
	Repositories: Backbone.Collection.extend({
		model: Gitode.Models.Repository,
		url: localhost+'/repository'
	})
};

Gitode.Views = {
	Home: Backbone.View.extend({
		el: '#content',
		collection: Gitode.Collections.Repositories,
		initialize: function() {
			this.render();
		},
		render: function() {
			var content = '';
			// Iterate through every element in the collection
			this.collection.each(function(model) {
				// Create the template
				content += _.template($("#repository_list_template").html(), model.attributes);
			});
			// Write the content to #content
			$(this.el).html(content);
			return this;
		}
	}),
	Repository: Backbone.View.extend({
		el: '#content',
		initialize: function() {
			this.render();
		},
		render: function() {
			// Create the template
			var content = _.template($("#repository_template").html(), this.model.attributes);
			// Write the content to #content
			$(this.el).html(content);
			return this;
		}
	}),
	RepositoryForm: Backbone.View.extend({
		el: '#content',
		/*events: {
			"change input": "changed",
			"change select": "changed"
		},*/
		initialize: function() {
			this.render();
		},
		render: function() {
		/**
		 * Note: I haven't found a good way to insert a form in backbone.js. There's a backbone-forms module, but I could not get it working properly. Feel free to attempt to improve it.
		 */
			var content = '<div id="form-error-box"></div><form method="post" action="'+localhost+'/repository/new" id="new_repository_form"><fieldset><li><label>Name*</label><div><input name="name" id="name" placeholder="Name" required="required" class="input"></div><div class="clear"></div></li><li><label>Description</label><div><textarea name="description" id="description" type="textbox" placeholder="Description" cols="40" rows="10"></textarea></div><div class="clear"></div></li><li><label>Project</label><div><input name="project" id="project" placeholder="Project" class="input"></div><div class="clear"></div></li><li><label>Private?</label><div class="select"><select id="public" name="public"><option value="Yes">Yes</option><option value="No">No</option></select></div><div class="clear"></div></li><li><label>Allow Pull Requests?</label><div class="select"><select id="allowPullRequests" name="allowPullRequests"><option value="Yes">Yes</option><option value="No">No</option></select></div><div class="clear"></div></li><li><div><input type="hidden" name="user" id="user" value="root"><input type="hidden" id="location"><input type="hidden" id="created"><input type="submit" class="submit"></div><div class="clear"></div></li></fieldset></form>';
			
			$(this.el).html(content);
			$("#new_repository_form").submit(function() {
				$.post($(this).attr('action'), $(this).serialize(), function(data) {
					console.log(data);
					if (typeof data.error === 'undefined') {
						window.location.hash = data.redirect;
					}
					else {
						$('#form-error-box').html(data.error);
					}
				});
				return false;
			});
			return this;
		}
//		changed: function(evt) {
//			var changed = evt.currentTarget;
//			var value = $("#" + changed.id).val();
//			var obj = '{"' + changed.id + '":"' + value + '"}';
//			var objInst = JSON.parse(obj);
//			this.model.set(objInst);
//		}
	}),
	Folder: Backbone.View.extend({
		el: '#content',
		initialize: function() {
			this.render();
		},
		render: function() {
			var content = _.template($("#folder_template").html(), this.model.attributes);
			$(this.el).html(content);
			return this;
		}
	}),
	File: Backbone.View.extend({
		el: '#content',
		initialize: function() {
			this.render();
		},
		render: function() {
			var content = _.template($("#file_template").html(), this.model.attributes);
			$(this.el).html(content);
			return this;
		}
	})
}

var Gitode_Collections_Repositories = new Gitode.Collections.Repositories();

Gitode.Router = Backbone.Router.extend({ /* define the route and function maps for this controller */
	routes: {
		'': 'home',
		'/': 'home',
		'/repository': 'home',
		'/repository/new': 'repositoryNew',
		'/repository/:slug': 'repository',
		'/repository/:slug/commits': 'repositoryCommits',
		'/repository/:slug/:hash/:path': 'repositoryFile',
		// Other
		'*other': 'defaultRoute'
		//This is a default route with that also uses a *splat. Consider the
		//default route a wildcard for URLs that are either not matched or where
		//the user has incorrectly typed in a route path manually
		/*Sample usage: http://unicorns.com/#/anything*/

	},
	home: function() {
		console.log('home');
		Gitode_Collections_Repositories.fetch({
			success: function(data) {
				var Gitode_Views_Repository = new Gitode.Views.Home({
					collection: Gitode_Collections_Repositories
				});
			},
			error: function(error) {
				console.log("Error: ", error, this);
			}
		});
	},
	repository: function(slug) {
		var Gitode_Models_Repository = new Gitode.Models.Repository({
			id: slug
		});
		
		Gitode_Models_Repository.fetch({
			success: function(model) {
				console.log(model);
				var Gitode_Views_Repository = new Gitode.Views.Repository({
					model: model
				});
			},
			error: function(error) {
				console.log("Error: ", error);
			}
		});
	},
	repositoryCommits: function(slug) {
		
	},
	repositoryFile: function(slug, hash, path) {
		if (path.match(/\..{1,5}$/)) {
			var Gitode_Models_File = new Gitode.Models.File();
			Gitode_Models_File.fetch({
				success: function(model) {
					var Gitode_Views_File = new Gitode.Views.File({
						model: Gitode_Models_File
					});
				},
				error: function(err) {
					console.log("Error: ", err);
				}
			});
		}
		else {
			var Gitode_Models_Folder = new Gitode.Models.Folder();
			Gitode_Models_Folder.fetch({
				success: function(model) {
					var Gitode_Views_Folder = new Gitode.Views.Folder({
						model: Gitode_Models_Folder
					});
				},
				error: function(err) {
					console.log("Error: ", err);
				}
			});
			
		}
	},
	repositoryNew: function() {
		var Gitode_Views_New = new Gitode.Views.RepositoryForm({
			collection: Gitode_Collections_Repositories
		});
		var repo = new Gitode.Models.Repository();
	},
	defaultRoute: function(other) {
		console.log("Invalid. You attempted to reach:" + other);
	}
});

$(function() {
	var myRouteController = new Gitode.Router;
	Backbone.history.start();
});