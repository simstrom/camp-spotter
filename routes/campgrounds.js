const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

// Renders index page of all campgrounds.
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

// Renders form for creating new campgrounds.
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// Saves a new campground to the db.
router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const newCamp = new Campground(req.body.campground);
		newCamp.author = req.user._id;
		await newCamp.save();
		req.flash('success', 'Successfully created a new campground!');
		res.redirect(`/campgrounds/${newCamp._id}`);
	})
);

// Renders page for individual campground
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
			.populate('reviews')
			.populate('author');
		if (!campground) {
			req.flash('error', `Sorry, we can't find that campground!`);
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);

// Renders form for for edit individual campground
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash('error', `Sorry, we can't find that campground!`);
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	})
);

// Handles update request to individual campground.
router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(
			id,
			req.body.campground
		);
		req.flash('success', 'Campground updated successfully!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// Handles delete request for individual campground.
router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		req.flash('success', 'Campground deleted successfully!');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
