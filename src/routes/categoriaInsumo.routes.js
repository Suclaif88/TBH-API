const { Router } = require('express');
const {
  crearCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaInsumo.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarCategorias);
router.post('/', crearCategoria);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;
