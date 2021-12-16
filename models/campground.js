const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const imageSchema = new Schema({
	url: String,
	filename: String,
});

imageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
	{
		title: String,
		images: [imageSchema],
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
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
	},
	opts
);

campgroundSchema.virtual('properties.popupMarkup').get(function () {
	return `<h6><a href="/campgrounds/${this._id}">${this.title}</a></h6>
			<p>${this.location}</p>`;
});

// Middleware for removing reviews related to a deleted campground
campgroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc.reviews.length > 0) {
		await Review.deleteMany({ _id: { $in: doc.reviews } });
	}
});

module.exports = mongoose.model('Campground', campgroundSchema);
