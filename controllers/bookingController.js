const Booking = require('../models/booking');
const Tour = require('../models/tour');

exports.renderNew = async (req, res) => {
  const { tourId } = req.query;
  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).send('Tour not found');
  // Lấy thông tin user từ session nếu có
  const user = req.session.user || null;
  res.render('bookings/new', { tour, session: req.session, user });
};

exports.createBooking = async (req, res) => {
  try {
    const { tourId, customerName, customerEmail } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).send('Tour not found');
    const booking = new Booking({
      tourId,
      price: tour.price,
      customerName,
      customerEmail
    });
    await booking.save();
    res.send('Booking confirmed! <a href="/tours">Back to tours</a>');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creating booking');
  }
};
