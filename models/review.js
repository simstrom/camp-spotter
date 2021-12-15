const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	created: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model('Review', reviewSchema);
