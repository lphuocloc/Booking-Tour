const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tiêu đề không được để trống"],
    unique: true,
    trim: true,
    minlength: 3,
  },
  subtitle: { type: String, trim: true },
  price: {
    type: Number,
    required: [true, "Giá không được để trống"],
    min: [0, "Giá phải lớn hơn 0"],
  },
  description: {
    type: String,
    required: [true, "Mô tả không được để trống"],
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
