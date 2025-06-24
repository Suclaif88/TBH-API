const { Router } = require('express');
const {
  crearInsumo,
  listarInsumos,
  obtenerInsumoPorId,
  obtenerInsumosActivos,
  obtenerInsumosBase,
  obtenerInsumosFrascos,
  obtenerInsumosFragancia,
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
router.get('/base', obtenerInsumosBase);
router.get('/frascos', obtenerInsumosFrascos);
router.get('/fragancias', obtenerInsumosFragancia);
router.get('/:id', obtenerInsumoPorId);
router.post('/', crearInsumo);
router.put('/:id', actualizarInsumo);
router.delete('/:id', eliminarInsumo);
router.patch('/estado/:id', cambiarEstado);

module.exports = router;
