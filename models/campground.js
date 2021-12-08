const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const campgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

// Middleware for removing reviews related to a deleted campground
campgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc.reviews.length > 0) {
		await Review.deleteMany({ _id: { $in: doc.reviews } });
	}
});

module.exports = mongoose.model('Campground', campgroundSchema);
