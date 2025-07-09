const { Router } = require('express');
const {
  crearInsumo,
  listarInsumos,
  obtenerInsumoPorId,
  obtenerInsumosActivos,
  obtenerInsumosPorCategoria,
  actualizarInsumo,
  eliminarInsumo,
  cambiarEstado
} = require('../controllers/insumo.controller');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Insumos'));

router.get('/', listarInsumos);
router.get('/activos', obtenerInsumosActivos);
router.get('/categoria/:nombre', obtenerInsumosPorCategoria);
router.get('/:id', obtenerInsumoPorId);
router.post('/', crearInsumo);
router.put('/:id', actualizarInsumo);
router.delete('/:id', eliminarInsumo);
router.patch('/estado/:id', cambiarEstado);

module.exports = router;
