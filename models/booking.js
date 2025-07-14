const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  price: Number,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  participants: Number,
  startDate: Date,
  date: { type: Date, default: Date.now },
  order_code: Number, // Mã đơn hàng PayOS
  status: { type: String, default: 'Pending' }, // Trạng thái: Pending, Paid, Cancelled
});
module.exports = mongoose.model('Booking', bookingSchema);
