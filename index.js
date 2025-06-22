require('dotenv').config({});
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactus');
const app = express();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/home' }),
  (req, res) => {
    // Issue JWT and redirect to frontend with token and user info
    const user = req.user;
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Redirect to frontend home page with token and email as query params
    const frontendUrl = `http://localhost:5173/oauth-success?token=${token}`;
    res.redirect(frontendUrl);
  }
);

app.use('/api/contact_messages', contactRoutes);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
