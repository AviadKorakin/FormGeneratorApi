const passportUtil = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User'); // Assuming you will create a User model
const axios = require('axios');
passportUtil.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://formgeneratorapi.onrender.com/users/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("GitHub Profile JSON:", JSON.stringify(profile, null, 2));

                let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (!email) {
                    // Fetch emails using the GitHub API
                    const { data } = await axios.get("https://api.github.com/user/emails", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    // Find the primary or first email
                    email = data.find((e) => e.primary)?.email || data[0]?.email;
                }

                if (!email) {
                    console.error("Email is still unavailable after fetching from API.");
                    return done(new Error("Email is required but not provided by GitHub."), null);
                }

                let user = await User.findOne({ githubId: profile.id });
                if (!user) {
                    user = await User.create({
                        githubId: profile.id,
                        username: profile.username,
                        email,
                        confirmed: false,
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
