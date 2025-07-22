const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const passport = require('passport');


router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/profile', passport.authenticate('jwt', { session: false }), authController.getUserProfile);

module.exports = router;
