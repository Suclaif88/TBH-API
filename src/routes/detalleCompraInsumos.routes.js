const { Router } = require('express');
const {
  crearDetalleCompraInsumo
} = require('../controllers/detallesCompraInsumos.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);


router.post('/', crearDetalleCompraInsumo);


module.exports = router;
