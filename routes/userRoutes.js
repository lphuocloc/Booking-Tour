var express = require('express')
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
var userRouter = express.Router();

// userRouter.route('/')
userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.LoginUser)
// Hiển thị form đăng ký
userRouter.get('/register', (req, res) => {
    res.render('auth/register');
});
// Hiển thị form đăng nhập
userRouter.get('/login', (req, res) => {
    res.render('auth/login');
});
// Show profile page (session only)
userRouter.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    res.render('user/profile', { user: req.session.user, session: req.session });
});
// Show edit profile form (session only)
userRouter.get('/profile/edit', (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    res.render('user/editProfile', { user: req.session.user, session: req.session });
});
// Handle profile update (session only)
userRouter.post('/profile/edit', async (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');
    // Call userController.updateProfile, but pass req.session.user._id
    req.user = req.session.user;
    await userController.updateProfile(req, res);
});
userRouter.get('/get',
    auth.authMiddleWare,
    auth.requireRole('admin'),
    userController.getAllUsers);
module.exports = userRouter