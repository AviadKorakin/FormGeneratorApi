const User = require('./models/User'); // Assuming you will create a User model

function ensureAuthenticated(req, res, next) {
    if (res.locals.user) {
        // Check if the user is banned
        if (res.locals.user.bannedUntil && new Date() < new Date(res.locals.user.bannedUntil)) {
            return res.redirect('/'); // Redirect to a banned page if the user is banned
        }

        // Check if the user's email is confirmed
        if (res.locals.user.confirmed) {
            return next(); // User is authenticated, not banned, and email is confirmed
        }

        // Redirect to confirmation pending page if email is not confirmed
        return res.redirect('/confirmation-pending');
    }
    // Redirect to the login page if not authenticated
    return res.redirect('/');
}

function ensureAuthenticatedInnerRoutes(req, res, next) {
    if (res.locals.user) {
        // Check if the user is banned
        if (res.locals.user.bannedUntil && new Date() < new Date(res.locals.user.bannedUntil)) {
            return res.status(403).json({ error: 'User is banned. Access denied.' });
        }

        // Check if the user's email is confirmed
        if (res.locals.user.confirmed) {
            return next(); // User is authenticated, not banned, and email is confirmed
        }

        // Respond with an error if the email is not confirmed
        return res.status(403).json({ error: 'Email not confirmed. Please verify your email.' });
    }
    // Respond with an error if the user is not authenticated
    return res.status(401).json({ error: 'User authentication required.' });
}

function ensureSecondStepAuthenticated(req, res, next) {
    if (res.locals.user) {
        // Check if the user is banned
        if (res.locals.user.bannedUntil && new Date() < new Date(res.locals.user.bannedUntil)) {
            return res.redirect('/'); // Redirect to a banned page if the user is banned
        }

        // Check if the user's email is confirmed
        if (res.locals.user.confirmed) {
            return res.redirect('/'); // Redirect to home if email is confirmed
        } else {
            return next(); // Proceed to second step if not confirmed
        }
    } else {
        return next(); // Proceed to second step if no user is logged in
    }
}

const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key']; // Retrieve the API key from request headers

        if (!apiKey) {
            return res.status(401).json({ error: 'API key is required' });
        }
        // Find a user with the provided API key
        const user = await User.findOne({ api_key: apiKey });
        if (!user) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        // Attach user to the request object for further use in the route
        req.user = user;
        next();
    } catch (error) {
        console.error('Error validating API key:', error);
        res.status(500).json({ error: 'Failed to validate API key' });
    }
};

module.exports = {
    ensureAuthenticated,
    ensureSecondStepAuthenticated,
    ensureAuthenticatedInnerRoutes,
    validateApiKey
};
