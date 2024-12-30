const passportUtil = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User'); // Assuming you will create a User model

passportUtil.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://formgeneratorapi.onrender.com/users/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Log the entire profile JSON from GitHub
                console.log("GitHub Profile JSON:", JSON.stringify(profile, null, 2));

                // Safeguard against missing emails
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (!email) {
                    console.error("GitHub profile does not have an email.");
                    return done(new Error("Email is required but not provided by GitHub."), null);
                }

                let user = await User.findOne({ githubId: profile.id });
                if (!user) {
                    user = await User.create({
                        githubId: profile.id,
                        username: profile.username,
                        email, // Use the validated email
                        confirmed: false, // Initial state
                    });
                }
                return done(null, user);
            } catch (error) {
                console.error("Error during GitHub callback:", error);
                return done(error, null);
            }
        }
    )
);


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
