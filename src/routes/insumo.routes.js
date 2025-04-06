const { Router } = require('express');
const {
  crearInsumo,
  listarInsumos,
  actualizarInsumo,
  eliminarInsumo
} = require('../controllers/insumo.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarInsumos);
router.post('/', crearInsumo);
router.put('/:id', actualizarInsumo);
router.delete('/:id', eliminarInsumo);

module.exports = router;
