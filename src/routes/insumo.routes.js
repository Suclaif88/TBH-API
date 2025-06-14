const { Router } = require('express');
const {
  crearInsumo,
  listarInsumos,
  obtenerInsumoPorId,
  actualizarInsumo,
  eliminarInsumo,
  cambiarEstado
} = require('../controllers/insumo.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarInsumos);
router.get('/:id', obtenerInsumoPorId);
router.post('/', crearInsumo);
router.put('/:id', actualizarInsumo);
router.delete('/:id', eliminarInsumo);
router.patch('/estado/:id', cambiarEstado);

module.exports = router;
