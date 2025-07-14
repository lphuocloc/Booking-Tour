const Tour = require('../models/tour');

exports.list = async (req, res) => {
  const tours = await Tour.find();
  res.render('admin/tours/index', { tours, session: req.session });
};

exports.newForm = (req, res) => {
  res.render('admin/tours/new', { session: req.session });
};

exports.create = async (req, res) => {
  const { title, price, description } = req.body;
  await Tour.create({ title, price, description });
  res.redirect('/admin/tours');
};

exports.editForm = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return res.redirect('/admin/tours');
  res.render('admin/tours/edit', { tour, session: req.session });
};

exports.update = async (req, res) => {
  const { title, price, description } = req.body;
  await Tour.findByIdAndUpdate(req.params.id, { title, price, description });
  res.redirect('/admin/tours');
};

exports.delete = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.redirect('/admin/tours');
};
