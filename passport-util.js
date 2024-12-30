const passportUtil = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User'); // Assuming you will create a User model

passportUtil.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = await User.create({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails[0].value,
                confirmed: false // Initial state
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passportUtil.serializeUser((user, done) => {
    done(null, user.id);
});

passportUtil.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passportUtil;
