const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router
	.route('/register')
	.get(controller.renderRegister)
	.post(catchAsync(controller.register));

router
	.route('/login')
	.get(controller.renderLogin)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		controller.login
	);

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;
