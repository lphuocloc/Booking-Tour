var express = require('express')
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
var userRouter = express.Router();

// userRouter.route('/')
userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.LoginUser)
userRouter.get('/profile', auth.authMiddleWare,
    userController.getProfile)
userRouter.put('/update/profile', auth.authMiddleWare,
    auth.requireRole('customer')
    , userController.updateProfile);
userRouter.get('/get',
    auth.authMiddleWare,
    auth.requireRole('admin'),
    userController.getAllUsers);
module.exports = userRouter