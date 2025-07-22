const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const passport = require('passport');

router.get('/stats', passport.authenticate('jwt', { session: false }), dashboardController.getDashboardStats);
router.get('/activity', passport.authenticate('jwt', { session: false }), dashboardController.getRecentActivity);

module.exports = router;
