const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/new', bookingController.renderNew);
router.post('/', bookingController.createBooking);
router.get('/payment-callback', bookingController.handlePaymentCallback);

module.exports = router;
