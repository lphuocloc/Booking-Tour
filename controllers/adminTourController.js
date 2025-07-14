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
    let error = "An error occurred!";
    if (err.name === "ValidationError") {
      error = Object.values(err.errors)
        .map((e) => e.message)
        .join(". ");
    } else if (err.code === 11000) {
      error = "Tour title already exists!";
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
    let error = "An error occurred!";
    if (err.name === "ValidationError") {
      error = Object.values(err.errors)
        .map((e) => e.message)
        .join(". ");
    } else if (err.code === 11000) {
      error = "Tour title already exists!";
    }
    // Get the old tour data to render the form again
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
      error: "Cannot delete this tour because it has bookings!",
    });
  }
  await Tour.findByIdAndDelete(tourId);
  res.redirect("/admin/tours");
};
