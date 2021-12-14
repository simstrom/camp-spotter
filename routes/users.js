const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

router.get('/register', (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/campgrounds');
	}
	res.render('users/register');
});

router.post(
	'/register',
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) return next(err);
				req.flash('success', 'Welcome to CampSpotter!');
				res.redirect('/campgrounds');
			});
		} catch (err) {
			req.flash('error', err.message);
			res.redirect('/register');
		}
	})
);

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/campgrounds');
	}
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.flash('success', `Welcome back!`);
		const returnUrl = req.session.returnUrl || '/campgrounds';
		delete req.session.returnUrl;
		res.redirect(returnUrl);
	}
);

router.get('/logout', isLoggedIn, (req, res) => {
	req.logOut();
	req.flash('success', 'Logged out. See you later!');
	res.redirect('/campgrounds');
});

module.exports = router;
