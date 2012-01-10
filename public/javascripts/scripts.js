var Gitode = {};

Gitode.Models = {
	Repository: Backbone.Model.extend({
		defaults: {
			name: 'name',
			location: 'location',
			owner: 'user',
			private: false
		}
	})
}

Gitode.Collections = {
	Repositories: Backbone.Collection.extend({
		model: Gitode.Models.Repository
	}),
};