const { Router } = require('express');

const router = Router();

router.post('/', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true, 
    sameSite: 'Strict' 
  });
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;
