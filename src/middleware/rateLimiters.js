const rateLimit = require('express-rate-limit');
const logger = require('../../logger');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Aumentar límite para desarrollo
  handler: (req, res) => {
    const message = `Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`;
    logger.warn(message);
    res.status(429).json({
      status: 'error',
      message: 'Demasiados intentos de login, espera 15 minutos e inténtalo de nuevo.'
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    const message = `Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`;
    logger.warn(message);
    res.status(429).json({
      status: 'error',
      message: 'Demasiados intentos de registro, espera 15 minutos e inténtalo de nuevo.'
    });
  },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000000000000000000000000000000000000000000000000000000, // se cambia por la chillona de nando
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const message = `Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`;
    logger.warn(message);
    res.status(429).json({
      status: 'error',
      message: 'Demasiadas peticiones, intenta de nuevo más tarde.'
    });
  },
});

module.exports = { loginLimiter, registerLimiter, limiter };
