const express = require('express');
const passport = require('../passport-util');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

// GitHub OAuth Routes
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/users/login' }),
    async (req, res) => {
        try {
            if (!process.env.email || !process.env.pass) {
                return res.status(500).send('Email setup is not configured.');
            }

            if (!req.user.confirmed) {
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.email,
                        pass: process.env.pass,
                    },
                });

                const confirmationUrl = `https://formgeneratorapi.onrender.com/users/confirm-email/${req.user.id}`;
                await transporter.sendMail({
                    from: process.env.email,
                    to: req.user.email,
                    subject: 'Confirm Your Email',
                    text: `Click the link to confirm your email: ${confirmationUrl}`,
                    html: `<a href="${confirmationUrl}">Confirm your email</a>`,
                });

                return res.redirect('/confirmation-pending');
            }

            res.redirect('/users/profile');
        } catch (error) {
            console.error('Error during GitHub callback:', error);
            res.status(500).send('An error occurred during login.');
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

        user.confirmed = true;
        await user.save();

        res.redirect('/confirmation-success');
    } catch (error) {
        console.error('Error confirming email:', error);
        res.status(500).send('Error confirming email.');
    }
});

// Resend Confirmation Email Route
router.get('/resend-confirmation', async (req, res) => {
    try {
        console.log("Checking authentication for resend-confirmation route.");
        if (!req.isAuthenticated()) {
            return res.status(401).send('Unauthorized. Please log in.');
        }

        console.log("User from session:", req.user); // Log the user object

        if (!req.user) {
            return res.status(500).send('User not found in session.');
        }

        const user = req.user;

        if (user.confirmed) {
            return res.redirect('/users/profile');
        }

        console.log("Resending confirmation email to:", user.email);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.email,
                pass: process.env.pass,
            },
        });

        const confirmationUrl = `https://formgeneratorapi.onrender.com/users/confirm-email/${user.id}`;
        await transporter.sendMail({
            from: process.env.email,
            to: user.email,
            subject: 'Confirm Your Email',
            text: `Click the link to confirm your email: ${confirmationUrl}`,
            html: `<a href="${confirmationUrl}">Confirm your email</a>`,
        });

        res.redirect('/confirmation-pending');
    } catch (error) {
        console.error('Error resending confirmation email:', error);
        res.status(500).send('Failed to resend confirmation email.');
    }
});

router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ loggedIn: true });
    }

    res.json({ loggedIn: false });
});

// Example Protected Route
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized. Please log in.');
    }
    if (!req.user.confirmed) {
        return res.status(403).send('Please confirm your email before accessing this page.');
    }
    res.send(`Welcome, ${req.user.username}`);
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(err => {
            if (err) return next(err);
            res.clearCookie('connect.sid'); // Remove the session cookie
            res.redirect('/'); // Redirect to the homepage
        });
    });
});


module.exports = router;
