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
                'QuickChat Email Verification',
                `
                <div style="
                background:#f4f7fb;
                padding:40px 20px;
                font-family:Arial,sans-serif;
                ">
                
                <div style="
                    max-width:500px;
                    margin:auto;
                    background:white;
                    border-radius:18px;
                    overflow:hidden;
                    box-shadow:0 8px 30px rgba(0,0,0,0.08);
                ">

                    <div style="
                    background:linear-gradient(135deg,#6366f1,#8b5cf6);
                    padding:30px;
                    text-align:center;
                    color:white;
                    ">
                    <h1 style="margin:0;">QuickChat</h1>
                    <p style="margin-top:8px;font-size:14px;">
                        Secure Email Verification
                    </p>
                    </div>

                    <div style="padding:35px 30px;color:#333;">

                    <h2>Hello 👋</h2>

                    <p style="line-height:1.7;">
                        Use the OTP below to verify your email for your
                        QuickChat account.
                    </p>

                    <div style="
                        margin:30px 0;
                        text-align:center;
                    ">
                        <span style="
                        display:inline-block;
                        background:#eef2ff;
                        color:#4f46e5;
                        padding:18px 40px;
                        font-size:34px;
                        font-weight:bold;
                        border-radius:14px;
                        letter-spacing:6px;
                        ">
                        ${otp}
                        </span>
                    </div>

                    <p style="
                        font-size:14px;
                        color:#666;
                        line-height:1.6;
                    ">
                        This OTP will expire in 5 minutes.
                        Do not share this code with anyone.
                    </p>

                    <hr style="
                        margin:30px 0;
                        border:none;
                        border-top:1px solid #eee;
                    ">

                    <p style="
                        text-align:center;
                        font-size:13px;
                        color:#888;
                    ">
                        © 2026 QuickChat. All rights reserved.
                    </p>

                    </div>

                </div>

                </div>
                `
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