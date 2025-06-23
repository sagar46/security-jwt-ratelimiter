const express = require('express');
const {signup, login, greetings} = require('../controllers/studentController');
const  verifyToken  = require('../middleware/securityMiddleware');
const rateLimiter = require('../middleware/rateLimitorMiddleware');
const rateLimiterOptions = require('../middleware/options');

const rateLimitor = rateLimiter(rateLimiterOptions);

const router = express.Router();

router.post('/signup',rateLimitor, signup);
router.post('/login',rateLimitor, login);

router.get('/greetings',rateLimitor,verifyToken, greetings);

module.exports = router;