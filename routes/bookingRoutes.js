const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/new', auth.requireLogin, bookingController.renderNew);
router.post('/', auth.requireLogin, bookingController.createBooking);
router.get('/payment-callback', bookingController.handlePaymentCallback);

module.exports = router;
