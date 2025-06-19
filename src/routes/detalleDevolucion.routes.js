const { Router } = require('express');
const {
  crearDetalleDevolucion,
  listarDetalleDevoluciones,
  obtenerDetalleDevolucionPorId,
  actualizarDetalleDevolucion,
  eliminarDetalleDevolucion,
} = require('../controllers/detalleDevolucion.controller.js');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Devoluciones'));

router.post('/', crearDetalleDevolucion);
router.get('/', listarDetalleDevoluciones);
router.get('/:id', obtenerDetalleDevolucionPorId);
router.put('/:id', actualizarDetalleDevolucion);
router.delete('/:id', eliminarDetalleDevolucion);

module.exports = router;
