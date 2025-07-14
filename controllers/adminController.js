const Booking = require("../models/booking");
const User = require("../models/user");

exports.dashboard = async (req, res) => {
  const bookings = await Booking.find().populate("tourId");
  res.render("admin/index", { bookings, session: req.session });
};

exports.accountList = async (req, res) => {
  const users = await User.find();
  res.render("admin/accounts", { users, session: req.session });
};
