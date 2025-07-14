const Tour = require('../models/tour');

exports.listTours = async (req, res) => {
  const tours = await Tour.find();
  res.render('tours/index', { tours, session: req.session });
};

exports.showTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).send('Tour not found');
    res.render('tours/show', { tour, session: req.session });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching tour');
  }
};
