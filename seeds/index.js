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
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '61b90d49ae4bf38f7501c8aa',
			location: `${locations[rand].city}, ${locations[rand].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: 'https://source.unsplash.com/collection/483251',
			description:
				'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae natus ipsum, repudiandae officiis non esse nulla consectetur explicabo voluptate rerum. Repellat quod odio ducimus mollitia perferendis distinctio culpa blanditiis corrupti?',
			price,
		});
		await camp.save();
	}
};

seedDatabase().then(() => {
	mongoose.connection.close();
});
