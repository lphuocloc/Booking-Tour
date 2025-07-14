var express = require('express')
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
var userRouter = express.Router();

// userRouter.route('/')
userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.LoginUser)
userRouter.post('/logout', authController.logout);
// Hiển thị form đăng ký
userRouter.get('/register', (req, res) => {
    res.render('auth/register');
});
// Hiển thị form đăng nhập
userRouter.get('/login', (req, res) => {
    res.render('auth/login');
});
// Show profile page (session only)
userRouter.get('/profile', auth.requireLogin, (req, res) => {
    res.render('user/profile', { user: req.session.user, session: req.session });
});
// Show edit profile form (session only)
userRouter.get('/profile/edit', auth.requireLogin, (req, res) => {
    res.render('user/editProfile', { user: req.session.user, session: req.session });
});
// Handle profile update (session only)
userRouter.post('/profile/edit', auth.requireLogin, async (req, res) => {
    req.user = req.session.user;
    await userController.updateProfile(req, res);
});
userRouter.get('/get',
    auth.authMiddleWare,
    auth.requireRole('admin'),
    userController.getAllUsers);
// API lấy lịch sử booking của user
userRouter.get('/bookings/history', auth.requireLogin, bookingController.getUserBookingHistory);
userRouter.get('/profile/booking-history', auth.requireLogin, (req, res) => {
    res.render('user/bookingHistory', { user: req.session.user, session: req.session });
});
module.exports = userRouter