const { Router } = require('express');
const { enviarCorreo } = require('../controllers/correo.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);

router.post('/confirmacion-pedido', enviarCorreo);

module.exports = router;
