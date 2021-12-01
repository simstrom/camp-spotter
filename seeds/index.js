const mongoose = require('mongoose');
const locations = require('./locations');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/camp-spotter');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
	console.log('Database Connected');
});

const sample = (array) => {
	return array[Math.floor(Math.random() * array.length)];
};

const seedDatabase = async () => {
	// await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const rand = Math.floor(Math.random() * 1000);
		const camp = new Campground({
			location: `${locations[rand].city}, ${locations[rand].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
		});
		await camp.save();
	}
};

seedDatabase().then(() => {
	mongoose.connection.close();
});
