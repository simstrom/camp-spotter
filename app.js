if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRouter = require('./routes/users');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/camp-spotter', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
	secret: 'this-is-secret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	if (!['/login', '/register', '/'].includes(req.originalUrl)) {
		req.session.returnUrl = req.originalUrl;
	}
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', userRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.get('/', (req, res) => {
	res.render('home');
});

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
