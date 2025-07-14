const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  price: Number,
  customerName: String,
  customerEmail: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', bookingSchema);
