function ensureAuthenticated(req, res, next) {
    if (res.locals.user) {
        // Check if the user's email is confirmed
        if (res.locals.user.confirmed) {
            return next(); // User is authenticated and email is confirmed
        }
        // Redirect to confirmation pending page if email is not confirmed
        return res.redirect('/confirmation-pending');
    }
    // Redirect to the login page if not authenticated
    return res.redirect('/');
}

function ensureAuthenticatedInnerRoutes(req, res, next) {
    if (res.locals.user) {
        // Check if the user's email is confirmed
        if (res.locals.user.confirmed) {
            return next(); // User is authenticated and email is confirmed
        }
        // Respond with an error if the email is not confirmed
        return res.status(403).json({ error: 'Email not confirmed. Please verify your email.' });
    }
    // Respond with an error if the user is not authenticated
    return res.status(401).json({ error: 'User authentication required.' });
}



function ensureSecondStepAuthenticated(req, res, next) {
    if (res.locals.user) {
        // Check if the user's email is confirmed
        if (res.locals.user.confirmed) {
            return res.redirect('/');
        }
        else  return next(); // User is authenticated
    }
    else  return next(); // User is authenticated
}

module.exports = {
    ensureAuthenticated,
    ensureSecondStepAuthenticated,
    ensureAuthenticatedInnerRoutes
};
