const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String
});
module.exports = mongoose.model('Tour', tourSchema);
