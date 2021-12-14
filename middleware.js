const { campgroundSchema, reviewSchema } = require('./utils/validators');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be logged in to do that!');
		return res.redirect('/login');
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) throw new ExpressError(400, error.details[0].message);
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', `You don't have permission to do that!`);
		return res.redirect(`/campgrounds/${campground._id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) throw new ExpressError(400, error.details[0].message);
	next();
};
