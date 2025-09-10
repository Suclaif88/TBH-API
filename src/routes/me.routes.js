const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint de prueba sin middleware
router.get('/test', (req, res) => {
  console.log('Endpoint /me/test ejecutado');
  res.json({ 
    message: 'Endpoint de prueba funcionando',
    cookies: req.cookies,
    headers: req.headers
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