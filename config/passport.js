const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Use Google profile for session, no DB
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    // Pass Google profile directly to session
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  // Store the whole profile in the session
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Retrieve the profile from the session
  done(null, user);
});

module.exports = passport;
