const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../utils/validators');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) throw new ExpressError(400, error.details[0].message);
	next();
};

// Renders index page of all campgrounds.
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

// Renders form for creating new campgrounds.
router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});

// Saves a new campground to the db.
router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res) => {
		const newCamp = new Campground(req.body.campground);
		await newCamp.save();
		req.flash('success', 'Successfully created a new campground!');
		res.redirect(`/campgrounds/${newCamp._id}`);
	})
);

// Renders page for individual campground
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			'reviews'
		);
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
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
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
	validateCampground,
	catchAsync(async (req, res) => {
		if (!req.body.campground)
			throw new ExpressError(400, 'Invalid Campground Data');
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, req.body.campground);
		req.flash('success', 'Campground updated successfully!');
		res.redirect(`/campgrounds/${id}`);
	})
);

// Handles delete request for individual campground.
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		req.flash('success', 'Campground deleted successfully!');
		res.redirect('/campgrounds');
	})
);

module.exports = router;
