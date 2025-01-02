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
    ensureSecondStepAuthenticated
};
