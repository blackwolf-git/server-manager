const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.put('/profile', passport.authenticate('jwt', { session: false }), userController.updateProfile);
router.get('/dashboard', passport.authenticate('jwt', { session: false }), userController.getUserDashboard);

module.exports = router;
