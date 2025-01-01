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
    res.redirect('/');
}

function ensureFirstStepAuthenticated(req, res, next) {
    if (res.locals.user) {
        return next(); // User is authenticated
    }
    // Redirect to the login page if not authenticated
    res.redirect('/');
}

module.exports = {
    ensureAuthenticated,
    ensureFirstStepAuthenticated,
};
