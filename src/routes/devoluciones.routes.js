const { Router } = require('express');
const {
  crearDevolucion,
  listarDevoluciones,
  obtenerDevolucionPorId,
  actualizarDevolucion,
  eliminarDevolucion,
  cambiarEstadoDevolucion
} = require('../controllers/devoluciones.controller.js');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Devoluciones'));

router.post('/', crearDevolucion);
router.get('/', listarDevoluciones);
router.get('/:id', obtenerDevolucionPorId);
router.put('/:id', actualizarDevolucion);
router.delete('/:id', eliminarDevolucion);
router.put('/estado/:id', cambiarEstadoDevolucion)

module.exports = router;
