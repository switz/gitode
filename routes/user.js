
exports.login = function(req, res) {
	res.render('login', {
		title: "hey"
	})
}

exports.loginPOST = function(req, res) {
	var post = req.body;
	if (post.user == 'john' && post.password == 'johnspassword') {
		req.session.user_id = johns_user_id_here;
		res.redirect('/');
	} else {
		res.send('Bad user/pass');
	}
}

exports.signup = function(req, res) {
}

exports.signupPOST = function(req, res) {
	auth.createNewUserAccount(req.body.username, req.body.password1, req.body.password2, req.body.email, req.body.ponies, function(err, user) {
		if ((err) || (!user)) {
			req.session.error = 'New user failed, please check your username and password.';
			res.redirect('back');
		} else if (user) {
			res.redirect('/login');
		}
	});
}

exports.logout = function(req, res) {
	req.session.destroy(function() {
		res.redirect('home');
	});
}