const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
    trim: true,
    minlength: 3,
  },
  subtitle: { type: String, trim: true },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be greater than 0"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: 10,
  },
  image: { type: String, trim: true },
  location: { type: String, trim: true },
  date: { type: String, trim: true },
  nextDate: { type: String, trim: true },
  stops: { type: String, trim: true },
  participants: { type: String, trim: true },
});

module.exports = mongoose.model("Tour", tourSchema);
