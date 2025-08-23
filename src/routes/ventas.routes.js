const { Router } = require('express');
const {
  listarVentas,
  obtenerVentaPorId,
  crearVenta,
  marcarVentaCompletada,
  anularVenta
} = require('../controllers/ventas.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Ventas'));

router.get('/', listarVentas);
router.get('/:id', obtenerVentaPorId);
router.post('/', crearVenta);
router.patch('/:id/completar', marcarVentaCompletada);
router.patch('/:id/anular', anularVenta);

module.exports = router;
