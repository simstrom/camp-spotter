const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/camp-spotter');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
	console.log('Database Connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('home');
});

// Renders index page of all campgrounds.
app.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

// Renders form for creating new campgrounds.
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

// Saves a new campground to the db.
app.post(
	'/campgrounds',
	catchAsync(async (req, res) => {
		if (!req.body.campground)
			throw new ExpressError(400, 'Invalid Campground Data');
		const newCamp = new Campground(req.body.campground);
		await newCamp.save();
		res.redirect(`/campgrounds/${newCamp._id}`);
	})
);

// Renders page for individual campground
app.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/show', { campground });
	})
);

// Renders form for for edit individual campground
app.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/edit', { campground });
	})
);

// Handles update request to individual campground.
app.put(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		if (!req.body.campground)
			throw new ExpressError(400, 'Invalid Campground Data');
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, req.body.campground);
		res.redirect(`/campgrounds/${id}`);
	})
);

// Handles delete request for individual campground.
app.delete(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		res.redirect('/campgrounds');
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
	res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('Serving on Port 3000!');
});
