require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {sequelize} = require('./models/index')
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactus')
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contact_messages',contactRoutes);


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