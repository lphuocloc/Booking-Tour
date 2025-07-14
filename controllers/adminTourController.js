const Tour = require("../models/tour");
const Booking = require("../models/booking");

exports.list = async (req, res) => {
  const tours = await Tour.find();
  res.render("admin/tours/index", { tours, session: req.session, error: null });
};

exports.newForm = (req, res) => {
  res.render("admin/tours/new", {
    session: req.session,
    error: null,
    form: {},
  });
};

exports.create = async (req, res) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.redirect("/admin/tours");
  } catch (err) {
    let error = "Có lỗi xảy ra!";
    if (err.name === "ValidationError") {
      error = Object.values(err.errors)
        .map((e) => e.message)
        .join(". ");
    } else if (err.code === 11000) {
      error = "Tiêu đề tour đã tồn tại!";
    }
    res.status(400).render("admin/tours/new", {
      session: req.session,
      error,
      form: req.body,
    });
  }
};

exports.editForm = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return res.redirect("/admin/tours");
  res.render("admin/tours/edit", { tour, session: req.session, error: null });
};

exports.update = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!tour) return res.redirect("/admin/tours");
    res.redirect("/admin/tours");
  } catch (err) {
    let error = "Có lỗi xảy ra!";
    if (err.name === "ValidationError") {
      error = Object.values(err.errors)
        .map((e) => e.message)
        .join(". ");
    } else if (err.code === 11000) {
      error = "Tiêu đề tour đã tồn tại!";
    }
    // Lấy lại dữ liệu tour cũ để render lại form
    const tour = await Tour.findById(req.params.id);
    res.status(400).render("admin/tours/edit", {
      tour: { ...tour.toObject(), ...req.body },
      session: req.session,
      error,
    });
  }
};

exports.delete = async (req, res) => {
  const tourId = req.params.id;
  const bookingCount = await Booking.countDocuments({ tourId });
  if (bookingCount > 0) {
    const tours = await Tour.find();
    return res.render("admin/tours/index", {
      tours,
      session: req.session,
      error: "Không thể xóa tour này vì đã có người đặt!",
    });
  }
  await Tour.findByIdAndDelete(tourId);
  res.redirect("/admin/tours");
};
