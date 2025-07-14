const Booking = require('../models/booking');
const Tour = require('../models/tour');
const { createPaymentLink } = require('../service/payOSService');

exports.renderNew = async (req, res) => {
  const { tourId } = req.query;
  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).send('Tour not found');
  // Lấy thông tin user từ session
  const user = req.session.user;
  res.render('bookings/new', { tour, session: req.session, user });
};

exports.createBooking = async (req, res) => {
  try {
    const { tourId, customerName, customerEmail, customerPhone, participants, startDate } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).send('Tour not found');

    // Tạo order_code cho PayOS
    const order_code = Number(String(Date.now()).slice(-6));
    const totalPrice = tour.price * Number(participants);

    // Tạo booking với trạng thái Pending
    const booking = new Booking({
      tourId,
      price: totalPrice,
      customerName,
      customerEmail,
      customerPhone,
      participants,
      startDate,
      order_code,
      status: 'Pending'
    });
    await booking.save();

    // Tạo link thanh toán PayOS
    const items = [{
      name: tour.title,
      quantity: Number(participants),
      price: tour.price
    }];
    const result = await createPaymentLink({
      order_code,
      amount: totalPrice,
      items,
      returnUrl: process.env.Return_Url + `?orderCode=${order_code}`,
      cancelUrl: process.env.Cancel_Url + `?orderCode=${order_code}`
    });

    // Trả về link QR cho FE
    res.json({
      success: true,
      paymentLink: result.checkoutUrl
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creating booking');
  }
};

exports.handlePaymentCallback = async (req, res) => {
  const { orderCode, status } = req.query;
  const booking = await Booking.findOne({ order_code: Number(orderCode) }).populate('tourId');
  if (!booking) return res.send('Không tìm thấy booking');
  if (status === 'PAID') {
    booking.status = 'Paid';
    await booking.save();
    return res.render('order/success', { booking });
  } else if (status === 'CANCELLED') {
    booking.status = 'Cancelled';
    await booking.save();
    return res.render('order/cancel', { booking });
  }
  res.send('Trạng thái không xác định');
};

// API: Lấy lịch sử booking của user (filter theo status)
exports.getUserBookingHistory = async (req, res) => {
  try {
    // Lấy userId từ session
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: 'Chưa đăng nhập' });
    const status = req.query.status;
    let query = { customerEmail: user.email };
    if (status && status !== 'all') {
      if (status === 'pending') query.status = 'Pending';
      else if (status === 'success') query.status = 'Paid';
      else if (status === 'cancel') query.status = 'Cancelled';
    }
    const bookings = await Booking.find(query).populate('tourId').sort({ date: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy lịch sử booking' });
  }
};
