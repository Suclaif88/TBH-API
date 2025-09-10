const { Router } = require('express');

const router = Router();

router.post('/', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax'
  });
  
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;
