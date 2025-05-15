const { Router } = require('express');
const {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  obtenerCategoriasRopa,
  obtenerCategoriasNoRopa,
  eliminarCategoria,
  cambiarEstadoCategoria
} = require('../controllers/categoriaProducto.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', obtenerCategorias);
router.get('/ropa', obtenerCategoriasRopa);
router.get('/no-ropa', obtenerCategoriasNoRopa);
router.get('/:id', obtenerCategoriaPorId);
router.post('/', crearCategoria);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);
router.put('/estado/:id', cambiarEstadoCategoria);


module.exports = router;
