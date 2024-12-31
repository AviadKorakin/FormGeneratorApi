const express = require('express');
const Feedback = require('../models/Feedback'); // Assuming the Feedback model is in the models directory
const validator = require('validator');
const {ensureAuthenticated} = require("../middlewares");
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { formId, email, responses } = req.body;

        // Log the request body for debugging
        console.log('Received Feedback Request:', req.body);

        // Validate required fields
        if (!formId) return res.status(400).json({ error: 'Field "formId" is required but missing.' });
        if (!email) return res.status(400).json({ error: 'Field "email" is required but missing.' });
        if (!responses || typeof responses !== 'object' || Object.keys(responses).length === 0) {
            return res.status(400).json({ error: 'Field "responses" must be a non-empty object.' });
        }

        // Validate email format using validator library
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format. Please provide a valid email address.' });
        }

        // Validate responses
        for (const [question, value] of Object.entries(responses)) {
            if (!value || typeof value !== 'object') {
                return res.status(400).json({
                    error: `Invalid response entry for question "${question}". Expected an object with "answer", "type", and "order". Received: ${JSON.stringify(value)}`,
                });
            }
            const { answer, type, order } = value;
            if (typeof answer !== 'string' || typeof type !== 'string') {
                return res.status(400).json({
                    error: `Invalid response format for question "${question}". "answer" and "type" must be strings. Received: ${JSON.stringify(value)}`,
                });
            }
            if (typeof order !== 'number') {
                return res.status(400).json({
                    error: `Invalid response format for question "${question}". "order" must be a number. Received: ${JSON.stringify(value)}`,
                });
            }
        }

        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({ formId, email });

        if (existingFeedback) {
            // Update existing feedback
            existingFeedback.responses = responses;
            existingFeedback.date = Date.now(); // Update the timestamp

            await existingFeedback.save();
            return res.status(200).json({ message: 'Feedback updated successfully!', feedback: existingFeedback });
        } else {
            // Create new feedback
            const feedback = new Feedback({
                formId,
                email,
                responses,
            });

            await feedback.save();
            return res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
        }
    } catch (error) {
        console.error('Error submitting feedback:', error.message);
        return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});


// Get All Feedbacks
router.get('/', ensureAuthenticated,async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/filter', async (req, res) => {
    try {
        const { formId, email, startDate, endDate } = req.query;

        // Build dynamic query
        const filter = {};

        // Log initial query parameters
        console.log('Received query parameters:', { formId, email, startDate, endDate });

        if (formId) {
            filter.formId = formId;
            console.log('Applied filter for formId:', formId);
        }
        if (email) {
            filter.email = new RegExp(email, 'i'); // Case-insensitive regex match
            console.log('Applied filter for email:', email);
        }
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
                console.log('Applied filter for startDate:', startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
                console.log('Applied filter for endDate:', endDate);
            }
        }

        // Log the final filter object before querying
        console.log('Final filter object:', JSON.stringify(filter, null, 2));

        // Query the database
        const feedbacks = await Feedback.find(filter);

        // Log the results
        console.log(`Found ${feedbacks.length} feedback(s) matching the criteria.`);
        res.status(200).json(feedbacks);
    } catch (error) {
        // Log the error
        console.error('Error filtering feedbacks:', error.message);
        console.error('Stack trace:', error.stack);

        // Return an error response
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/analytics', ensureAuthenticated,async (req, res) => {
    try {
        const { formId, startDate, endDate } = req.query;

        // Build the filter object dynamically
        const filter = {};
        if (formId) filter.formId = formId;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) {
                // Add 1 day minus 1 second to include the full day for the endDate
                const adjustedEndDate = new Date(endDate);
                adjustedEndDate.setHours(23, 59, 59, 999);
                filter.date.$lte = adjustedEndDate;
            }
        }

        // Fetch matching feedbacks
        const feedbacks = await Feedback.find(filter);

        // Aggregate analytics
        const analytics = {};

        feedbacks.forEach((feedback) => {
            const responses = feedback.responses;

            for (const [question, { answer }] of responses.entries()) {
                if (!analytics[question]) {
                    analytics[question] = {};
                }
                if (!analytics[question][answer]) {
                    analytics[question][answer] = 0;
                }
                analytics[question][answer]++;
            }
        });

        // Transform and sort the analytics object
        const analyticsArray = Object.entries(analytics)
            .map(([question, answers]) => {
                const stats = Object.entries(answers)
                    .map(([answer, count]) => ({ answer, count }))
                    .sort((a, b) => {
                        // First, sort by count in descending order
                        if (b.count !== a.count) {
                            return b.count - a.count;
                        }
                        // If counts are equal, sort by answer lexicographically
                        return a.answer.localeCompare(b.answer);
                    });

                return { question, stats };
            })
            .sort((a, b) => a.question.localeCompare(b.question)); // Sort questions alphabetically


        res.status(200).json(analyticsArray);
    } catch (error) {
        console.error('Error generating analytics:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
