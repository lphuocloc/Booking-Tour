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

exports.accountDetail = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.render("admin/accountDetail", { user, session: req.session });
};
