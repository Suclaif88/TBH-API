const express = require('express');
const router = express.Router();
const { register,
        login } = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiters');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

module.exports = router;