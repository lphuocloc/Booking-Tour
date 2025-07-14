require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminTourRoutes = require('./routes/adminTourRoutes');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tour-booking')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// attach session to locals so EJS can use it easily
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use('/', authRoutes);
app.use('/tours', tourRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/tours', adminTourRoutes);

app.get('/', (req, res) => res.redirect('/tours'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
