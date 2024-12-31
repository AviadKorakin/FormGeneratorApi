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

            const currentSessionId = req.sessionID;
            const sessionStore = req.sessionStore;

            if (sessionStore && typeof sessionStore.all === 'function') {
                sessionStore.all((err, sessions) => {
                    if (err) {
                        console.error('Error accessing session store:', err);
                        return res.status(500).send('Session store error.');
                    }

                    try {
                        // Filter for user sessions based on the user ID
                        const userSessionIds = Object.values(sessions) // Get all session objects
                            .filter((session) => session.passport && session.passport.user === req.user.id) // Filter sessions matching user ID
                            .map((session) => session._id); // Extract session IDs

                        console.log("User session IDs:", userSessionIds);
                        console.log("Current session ID:", currentSessionId);

                        // Destroy all sessions except the current one
                        userSessionIds.forEach((sessionId) => {
                            if (sessionId !== currentSessionId) {
                                sessionStore.destroy(sessionId, (err) => {
                                    if (err) {
                                        console.error(`Failed to destroy session ${sessionId}:`, err);
                                    } else {
                                        console.log(`Destroyed session ${sessionId}`);
                                    }
                                });
                            }
                        });
                    } catch (error) {
                        console.error("Error processing sessions:", error);
                        return res.status(500).send('Failed to process sessions.');
                    }
                });
            }


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

            res.redirect('/');
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
            return res.redirect('/');
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
        if (!req.user.confirmed) {
            // If the user's email is not confirmed, redirect to confirmation page
            return res.json({ loggedIn: true, confirmed: false });
        }
        // User is logged in and confirmed
        return res.json({ loggedIn: true, confirmed: true });
    }
    // User is not logged in
    res.json({ loggedIn: false });
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
