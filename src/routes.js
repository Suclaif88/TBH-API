const express = require('express');
const router = express.Router();
const generarToken = require('./utils/generarToken');
const authMiddleware = require('./middleware/authMiddleware');

//Aqui van las rutas abajo hay un ejemplo de una ruta protegida por el midleware
// Ruta protegida que usa el middleware de autenticación
// router.get('/protegido', authMiddleware, (req, res) => {
//     res.json({ message: 'Acceso permitido a la ruta protegida', usuario: req.user });
// });


//Asi se generan los tokens
// router.get('/get-token', (req, res) => {
//     // Crear un "usuario" ficticio para generar el token
//     const user = { id: 1, email: 'usuario@ejemplo.com' };
  
//     // Generar el token utilizando la función generarToken
//     const token = generarToken(user);
  
//     // Devolver el token al cliente
//     res.json({ token });
//   });

module.exports = router;
