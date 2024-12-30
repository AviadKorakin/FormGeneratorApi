const express = require('express');
const passport = require('../passport-util');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// Initialize Passport middleware
router.use(passport.initialize());
router.use(passport.session());

// GitHub OAuth Routes
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            // Check if email setup is configured
            if (!process.env.email || !process.env.pass) {
                return res.status(500).send('Email setup is not configured.');
            }

            // Send email confirmation
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.email,
                    pass: process.env.pass,
                },
            });

            const confirmationUrl = `http://localhost:3000/users/confirm-email/${req.user.id}`;
            await transporter.sendMail({
                from: process.env.email,
                to: req.user.email,
                subject: 'Confirm Your Email',
                text: `Click the link to confirm your email: ${confirmationUrl}`,
                html: `<a href="${confirmationUrl}">Confirm your email</a>`,
            });

            res.redirect('/confirmation-pending'); // Redirect to a confirmation-pending page
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            res.status(500).send('Failed to send confirmation email.');
        }
    }
);

// Email Confirmation Route
router.get('/confirm-email/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Update confirmation status
        user.confirmed = true;
        await user.save();

        res.redirect('/confirmation-success'); // Redirect to a success page
    } catch (error) {
        console.error('Error confirming email:', error);
        res.status(500).send('Error confirming email.');
    }
});

// Example Protected Route
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized. Please log in.');
    }
    res.send(`Welcome, ${req.user.username}`);
});

module.exports = router;
