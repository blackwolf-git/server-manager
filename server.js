require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const db = require('./config/db');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require('./config/passport')(passport); 
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
db.authenticate()
  .then(() => logger.info('Database connected...'))
  .catch(err => logger.error('Unable to connect to the database:', err));

// Sync models
db.sync({ alter: true })
  .then(() => logger.info('Database synced'))
  .catch(err => logger.error('Error syncing database:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
