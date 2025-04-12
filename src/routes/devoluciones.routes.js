const { Router } = require('express');
const {
  crearDevolucion,
  listarDevoluciones,
  obtenerDevolucionPorId,
  actualizarDevolucion,
  eliminarDevolucion
} = require('../controllers/devoluciones.controller.js');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.post('/', crearDevolucion);
router.get('/', listarDevoluciones);
router.get('/:id', obtenerDevolucionPorId);
router.put('/:id', actualizarDevolucion);
router.delete('/:id', eliminarDevolucion);

module.exports = router;
