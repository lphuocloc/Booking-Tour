// const user = require('../model/user');
var User = require('../models/user')
var bryctjs = require('bcryptjs')
var jwt = require('jsonwebtoken')
exports.registerUser = async (req, res) => {
    console.log(req.body)
    try {
        const { username, password, phonenumber, email, fullname } = req.body
        const checkuserName = await User.findOne({ username });
        if (checkuserName) {
            return res.status(400).json({ message: "Please Create New UserName" })
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
        const save = await newUser.save()
        res.status(200).json({
            message: "User register successfully",
            error: false,
            success: true,
            data: {
                username: newUser.username,
                password: newUser.password,
                phonenumber: newUser.phonenumber,
                email: newUser.email,
                fullname: newUser.fullname
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        })
    }
}
exports.LoginUser = async (req, res) => {
    const secretKey = process.env.SECRET_KEY
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        console.log("1", user);
        if (!user) {
            return res.status(400).json({
                message: "User not register",
                error: true,
                success: false,
            })
        }
        const checkPassword = await bryctjs.compare(password, user.password);
        if (!checkPassword) {
            return res.status(404).json({
                message: "Invalid credential",
                error: true,
                success: false
            })
        }
        const accessToken = jwt.sign({
            userId: user._id,
            userName: user.username
        }, secretKey, { expiresIn: '2h' })
        res.status(202).json({ status: true, accessToken })
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "Profile get successfully",
            error: false,
            success: true,
            data: {
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                fullname: user.fullname,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
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
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, user: updatedUser });
    } catch (error) {

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