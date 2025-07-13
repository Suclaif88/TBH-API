const { Router } = require('express');
const {
  listarVentas,
  obtenerVentaPorId
} = require('../controllers/ventas.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Ventas'));

router.get('/', listarVentas);
router.get('/:id', obtenerVentaPorId);

module.exports = router;
