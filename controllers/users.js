const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { capitalize } = require('../utils/utility');

module.exports.renderRegister = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/campgrounds');
	}
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', `Welcome to CampSpotter, ${capitalize(username)}!`);
			res.redirect('/campgrounds');
		});
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/register');
	}
};

module.exports.renderLogin = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/campgrounds');
	}
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', `Welcome back, ${capitalize(req.user.username)}!`);
	const returnUrl = req.session.returnUrl || '/campgrounds';
	delete req.session.returnUrl;
	res.redirect(returnUrl);
};

module.exports.logout = (req, res) => {
	req.logOut();
	req.flash('success', 'Logged out. See you later!');
	res.redirect('/campgrounds');
};

module.exports.profile = async (req, res) => {
	const id = res.locals.currentUser._id;
	const campgrounds = (
		await Campground.find({ author: { $in: id } })
	).reverse();
	const reviews = (
		await Review.find({ author: { $in: id } }).populate('campground')
	).reverse();
	res.render('users/profile', { campgrounds, reviews });
};
