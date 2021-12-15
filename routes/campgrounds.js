const express = require('express');
const router = express.Router();
const controller = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router
	.route('/')
	.get(catchAsync(controller.index))
	.post(
		isLoggedIn,
		validateCampground,
		catchAsync(controller.createCampground)
	);

router.get('/new', isLoggedIn, controller.renderNewForm);

router
	.route('/:id')
	.get(catchAsync(controller.showCampground))
	.put(
		isLoggedIn,
		isAuthor,
		validateCampground,
		catchAsync(controller.updateCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(controller.deleteCampground));

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(controller.renderEditForm)
);

module.exports = router;
