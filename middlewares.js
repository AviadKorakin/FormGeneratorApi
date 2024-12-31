

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // Check if the user's email is confirmed
        if (req.user && req.user.confirmed) {
            return next(); // User is authenticated and email is confirmed
        }
        // Redirect to confirmation pending page if email is not confirmed
        return res.redirect('/confirmation-pending');
    }
    // Redirect to the login page if not authenticated
    res.redirect('/');
}
function ensureFirstStepAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated and email is confirmed
    }
    res.redirect('/');
}

module.exports = {
    ensureAuthenticated,
    ensureFirstStepAuthenticated
};
