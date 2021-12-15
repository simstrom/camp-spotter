const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');

router.post(
	'/',
	isLoggedIn,
	validateReview,
	catchAsync(controller.createReview)
);

router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(controller.deleteReview)
);

module.exports = router;
