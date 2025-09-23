const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint de prueba sin middleware
router.get('/test', (req, res) => {
  console.log('Endpoint /me/test ejecutado');
  res.json({ 
    message: 'Endpoint de prueba funcionando',
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent'],
      cookie: req.headers.cookie
    }
  });
});

// Endpoint para probar configuración de cookies
router.get('/cookie-test', (req, res) => {
  // Configurar una cookie de prueba
  res.cookie("test-cookie", "test-value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 60 * 60 * 1000
  });
  
  res.json({
    message: 'Cookie de prueba configurada',
    cookies_sent: req.cookies,
    environment: process.env.NODE_ENV
  });
});

router.get('/', authMiddleware, (req, res) => {
  console.log('Endpoint /me ejecutado - req.user:', req.user);
  
  if (!req.user) {
    console.log('Usuario no autenticado, devolviendo null');
    return res.json({ user: null, message: 'No hay usuario autenticado' });
  }
  
  console.log('Usuario autenticado:', req.user.id);
  return res.json({ user: req.user, message: 'Usuario autenticado' });
});

module.exports = router;