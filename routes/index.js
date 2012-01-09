/*
 * GET home page.
 */

var git = require('nodegit');

exports.index = function(req, res){
   git.repo( '.git', function( err, repo ) {
        // Success is always 0, failure is always an error string
        if( err ) {
          throw new Error( err );
        }
  
        // Use the master branch
        repo.branch( 'master', function( err, branch ) {
            if( err ) {
              throw new Error( err );
            }
            
            // Iterate over the revision history
            var history = branch.history();
            history.on( 'commit', function( index, commit ) {
                // Print out `git log` emulation
                console.log( 'commit ' + commit.sha );
                console.log( '\n' );
                console.log( commit.author.name + '<' + commit.author.email + '>' );
                console.log( commit.time );
                console.log( commit.message );
            });
  
            history.on( 'end', function() {
              // Continue
            });
        });
    });
};