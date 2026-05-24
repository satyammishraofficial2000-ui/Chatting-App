const express = require('express');
const router = express.Router();
const OTP = require('../modules/otpModel');
const sendEmail = require('../utils/sendEmail');
const User = require('../modules/user');

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ email });
        await OTP.create({
            email,
            otp
        });
        await sendEmail(
            email,
            'QuickChat OTP Verification',
            `Your OTP is ${otp}`
        );
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.post('/verify-otp', async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const existingOTP = await OTP.findOne({ email, otp });

        if (!existingOTP) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        await OTP.deleteMany({ email });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }

});

router.post('/check-email', async (req, res) => {

    try {

        const { email } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {

            return res.status(400).json({
                success: false,
                message: 'Account not found'
            });

        }

        res.status(200).json({
            success: true,
            message: 'Account exists'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

});

module.exports = router;