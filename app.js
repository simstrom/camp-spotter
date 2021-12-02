const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
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
app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

// Renders form for creating new campgrounds.
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

// Saves a new campground to the db.
app.post('/campgrounds', async (req, res) => {
	const newCamp = new Campground(req.body.campground);
	await newCamp.save();
	res.redirect(`/campgrounds/${newCamp._id}`);
});

// Renders page for individual campground
app.get('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/show', { campground });
});

// Renders form for for edit individual campground
app.get('/campgrounds/:id/edit', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/edit', { campground });
});

// Handles update request to individual campground.
app.put('/campgrounds/:id', async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndUpdate(id, req.body.campground);
	res.redirect(`/campgrounds/${id}`);
});

// Handles delete request for individual campground.
app.delete('/campgrounds/:id', async (req, res) => {
	// const { id } = req.params;
	await Campground.findByIdAndDelete(req.params.id);
	res.redirect('/campgrounds');
});

app.listen(3000, () => {
	console.log('Serving on Port 3000!');
});
