const { Router } = require('express');
const {
    listarProductos,
    obtenerProductoById,
    crearProducto,
    eliminarProducto,
    actualizarProducto,
    cambiarEstadoProducto
} = require('../controllers/productos.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarProductos);
router.get('/:id', obtenerProductoById);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.put('/estado/:id', cambiarEstadoProducto)
router.delete('/:id', eliminarProducto);

module.exports = router;
