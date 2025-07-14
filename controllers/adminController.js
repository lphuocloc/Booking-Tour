const Booking = require('../models/booking');

exports.dashboard = async (req, res) => {
  const bookings = await Booking.find().populate('tourId');
  res.render('admin/index', { bookings, session: req.session });
};
