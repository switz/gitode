var gits = require('gits');

exports.file = function(req, res) {
	// Make sure path is a file
	//console.log(req.params);
	var path = req.params[2] == '/' || !req.params[2] ? '' : req.params[2],
		gitHash = req.params[1],
		repoDir = __dirname + '/../repositories/' + req.params[0];
	gits.git(repoDir, ['show', '-s', '--format="%ci"', gitHash], function(dateErr, dateStdout, dateStderr) {

		gits.git(repoDir, ['show', gitHash + ':' + path], function(err, stdout, stderr) {

			// Reorganize file output template. throw into array and then create urls repo/this-repo.../blob/master/filename.md
			var files = {};
			/**
			 * Get file list and throw it into an array
			 * Remove the first two lines - they look as such:
			 * -----
			 * COMMIT HASH: 
			 * 
			 * file1
			 * file2
			 * ...
			 * -----
			 */
			files.Contents = stdout;
			files.ModifiedDate = dateStdout;
			if (!err) {
				console.log(files);
				return res.json(files);
			}

		});
	});
}

exports.folder = function(req, res) {
	var gitHash = req.params[1],
		path = req.params[2] === '/' || req.params[2] === '' ? '' : req.params[2],
		repoDir = __dirname + '/../repositories/' + req.params[0];
	// Get date of last hash
	gits.git(repoDir, ['show', '-s', '--format="%ci"', gitHash], function(dateErr, dateStdout, dateStderr) {
		//console.log(dateStdout);
		// Get directory listing of last hash
		gits.git(repoDir, ['show', gitHash + ':' + path], function(err, stdout, stderr) {

			// Reorganize file output template. throw into array and then create urls repo/this-repo.../blob/master/filename.md
			if (!err) {
				var files = {};
				files.Folders = {};
				files.Files = {};
				/**
				 * Get file list and throw it into an array
				 * Remove the first two lines - they look as such:
				 * -----
				 * COMMIT HASH: 
				 * 
				 * file1
				 * file2
				 * ...
				 * -----
				 */
				var ls = stdout.replace(/\n/g, ',').replace(/,$/, '').split(',').splice(2);
				files = FixLSArray(ls, dateStdout);
				return res.json(files);
			}
		});
	});

	function FixLSArray(ls, dateStdout) {
		if (ls instanceof Array) {
			var output = {},
				folders = [],
				files = [];

			ls.forEach(function(file, i) {
				var currentFile = {};
				// Set object 
				currentFile.Name = file;
				currentFile.ModifiedDate = dateStdout;

				if (file.match(/\/$/)) {
					folders[folders.length] = currentFile;
				} else {
					files[files.length] = currentFile;
				}

			});
			//console.log(folders, files);
			output.Folders = folders;
			output.Files = files;

			return output;
		}
	}
}

exports.filePUT = function(req, res) {

}

exports.folderPUT = function(req, res) {

}