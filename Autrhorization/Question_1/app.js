require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/user.model');

const app = express();

// Passport GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK,
    scope: [ 'user:email' ]
  },
  async function(accessToken, refreshToken, profile, done) {
    const email = profile.emails?.[0]?.value || '';
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        email
      });
    }
    done(null, user);
  }
));

app.use(passport.initialize());

// GitHub Auth Route
app.get('/auth/github', passport.authenticate('github', { session: false }));

// GitHub Callback
app.get('/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  }
);

// Connect MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
}).catch(err => console.error(err));
