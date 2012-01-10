var gitEmit = require('git-emit');

exports.push = function (repo) {
	var repoDir = __dirname+"/../repositories/"+repo;
	gitEmit(repoDir).on('update', function (update) {
		console.log('update!');
		update.accept();
	});
  console.log('repo ', repo);
}