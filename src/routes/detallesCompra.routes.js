const { Router } = require('express');
const {
    crearDetalles
} = require('../controllers/detallesCompra.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.post('/', crearDetalles);

module.exports = router;