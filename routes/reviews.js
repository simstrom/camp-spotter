const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../middleware');

const Review = require('../models/review');
const Campground = require('../models/campground');

// Saves a new review to a specific campground
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash('success', 'Successfully created a new review!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// Delete a review and remove it from referenced campground
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'Review deleted successfully!');
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
