const { Router } = require('express');
const {
  crearDetalleCompraProducto
} = require('../controllers/detallesCompraProductos.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);


router.post('/', crearDetalleCompraInsumo);


module.exports = router;
