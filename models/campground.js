const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const campgroundSchema = new Schema({
	title: String,
	images: [
		{
			url: String,
			fileName: String,
		},
	],
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	updated: {
		type: Date,
		default: new Date(),
	},
});

// Middleware for removing reviews related to a deleted campground
campgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc.reviews.length > 0) {
		await Review.deleteMany({ _id: { $in: doc.reviews } });
	}
});

module.exports = mongoose.model('Campground', campgroundSchema);
