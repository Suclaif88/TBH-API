const { Router } = require('express');
const {
  crearDevolucion,
  listarDevoluciones,
  obtenerDevolucionPorId,
  eliminarDevolucion,
  cambiarEstadoDevolucion,
  obtenerComprasRopaCliente,
} = require('../controllers/devoluciones.controller.js');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Devoluciones'));

router.post('/', crearDevolucion);
router.get('/', listarDevoluciones);
router.get('/:id', obtenerDevolucionPorId);

router.delete('/:id', eliminarDevolucion);

router.put('/:id/estado', cambiarEstadoDevolucion);

router.get('/cliente/:id/compras-ropa', obtenerComprasRopaCliente);

module.exports = router;

