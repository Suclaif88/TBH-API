const { Router } = require('express');
const {
  listarCategorias,
  obtenerCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaProducto.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarCategorias);
router.get('/:id', obtenerCategoriaById);
router.post('/', crearCategoria);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;
