const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

router.get('/', tourController.listTours);
router.get('/:id', tourController.showTour);

module.exports = router;
