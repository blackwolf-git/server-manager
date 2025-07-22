const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const meetingController = require('../controllers/meetingController');
const auth = require('../middleware/auth');

// مسارات المصادقة
router.post('/register', authController.register);
router.post('/login', authController.login);

// مسارات طلبات الاتصال
router.post('/contact', auth, contactController.createContactRequest);
router.get('/my-requests', auth, contactController.getUserRequests);

// مسارات المواعيد
router.post('/meetings', auth, meetingController.scheduleMeeting);
router.get('/timeslots', meetingController.getAvailableTimeslots);

module.exports = router;
