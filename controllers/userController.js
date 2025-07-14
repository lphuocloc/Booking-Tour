// const user = require('../model/user');
var User = require('../models/user')
var bryctjs = require('bcryptjs')
var jwt = require('jsonwebtoken')
exports.registerUser = async (req, res) => {
    try {
        const { username, password, phonenumber, email, fullname } = req.body
        const checkuserName = await User.findOne({ username });
        if (checkuserName) {
            req.session.toast = { type: 'error', message: 'Username already exists. Please choose another.' };
            return res.redirect('/users/register');
        }
        const salt = await bryctjs.genSalt(10)
        const hashPassword = await bryctjs.hash(password, salt)
        const payload = {
            username,
            password: hashPassword,
            phonenumber,
            email,
            fullname,
        }
        const newUser = new User(payload);
        await newUser.save();
        req.session.toast = { type: 'success', message: 'Register successfully! Please login.' };
        return res.redirect('/users/login');
    } catch (error) {
        req.session.toast = { type: 'error', message: error.message || 'Server error' };
        return res.redirect('/users/register');
    }
}

exports.LoginUser = async (req, res) => {
    const secretKey = process.env.SECRET_KEY
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            req.session.toast = { type: 'error', message: 'User not registered.' };
            return res.redirect('/users/login');
        }
        const checkPassword = await bryctjs.compare(password, user.password);
        if (!checkPassword) {
            req.session.toast = { type: 'error', message: 'Invalid credentials.' };
            return res.redirect('/users/login');
        }
        // Set session for logged in user
        req.session.user = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            role: user.role
        };
        req.session.toast = { type: 'success', message: 'Login successful!' };
        return res.redirect('/tours');
    } catch (error) {
        req.session.toast = { type: 'error', message: error.message || 'Server error' };
        return res.redirect('/users/login');
    }
}
exports.getProfile = async (req, res) => {
    try {
        // Use session user if available
        const user = req.session.user || req.user;
        res.render('user/profile', { user, session: req.session });
    } catch (error) {
        req.session.toast = { type: 'error', message: error.message || 'Server error' };
        res.redirect('/tours');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { password, phonenumber, email, fullname } = req.body
        const updates = {}
        if (phonenumber) updates.phonenumber = phonenumber;
        if (email) updates.email = email;
        if (fullname) updates.fullname = fullname;
        if (password) {
            const salt = await bryctjs.genSalt(10);
            updates.password = await bryctjs.hash(password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        // Update session user
        req.session.user = {
            _id: updatedUser._id,
            username: updatedUser.username,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            phonenumber: updatedUser.phonenumber,
            role: updatedUser.role
        };
        req.session.toast = { type: 'success', message: 'Profile updated successfully!' };
        res.redirect('/users/profile');
    } catch (error) {
        req.session.toast = { type: 'error', message: error.message || 'Server error' };
        res.redirect('/users/profile');
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách người dùng thành công',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};