const express = require('express');
const router = express.Router();
const { register,
        login,
        activate,
        resetPassword,
        forgotPassword,
     } = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiters');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/activate/:token', activate);    

module.exports = router;