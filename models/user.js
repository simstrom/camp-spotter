const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const { capitalize } = require('../utils/utility');

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});
userSchema.plugin(passportLocalMongoose);

userSchema.virtual('capitalized').get(function () {
	return capitalize(this.username);
});

module.exports = mongoose.model('User', userSchema);
