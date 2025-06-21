const { Router } = require('express');
const {
    obtenerProductos,
    obtenerProductoById,
    crearProducto,
    eliminarProducto,
    actualizarProducto,
    cambiarEstadoProducto
} = require('../controllers/productos.controller');
const upload = require("../middleware/upload");
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoById);
router.post('/', upload.array('imagenes', 5), crearProducto);
router.put('/:id', upload.array('imagenes', 5), actualizarProducto);
router.put('/estado/:id', cambiarEstadoProducto)
router.delete('/:id', eliminarProducto);

module.exports = router;
