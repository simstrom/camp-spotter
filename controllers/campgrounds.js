const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const { cloudinary } = require('../cloudinary');

const getGeoData = async (req) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	return geoData;
};

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
	const geoData = await getGeoData(req);
	const campground = new Campground(req.body.campground);
	campground.location = geoData.body.features[0].place_name;
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map((file) => ({
		url: file.path,
		filename: file.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	req.flash('success', 'Successfully created a new campground!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author',
			},
		})
		.populate('author');
	if (!campground) {
		req.flash('error', `Sorry, we can't find that campground!`);
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', `Sorry, we can't find that campground!`);
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	const geoData = await getGeoData(req);
	const campground = await Campground.findByIdAndUpdate(
		id,
		req.body.campground
	);
	campground.location = geoData.body.features[0].place_name;
	campground.geometry = geoData.body.features[0].geometry;
	campground.updated = Date.now();
	const imgs = req.files.map((file) => ({
		url: file.path,
		filename: file.filename,
	}));
	campground.images.push(...imgs);
	await campground.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash('success', 'Campground updated successfully!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const campground = await Campground.findByIdAndDelete(req.params.id);
	for (let img of campground.images) {
		await cloudinary.uploader.destroy(img.filename);
	}
	req.flash('success', 'Campground deleted successfully!');
	res.redirect('/campgrounds');
};
