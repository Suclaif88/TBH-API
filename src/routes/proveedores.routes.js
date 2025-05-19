const { Router } = require('express');
const {
obtenerProveedores,
obtenerProveedorPorId,
obtenerProveedoresActivos,
crearProveedor,
actualizarProveedor,
eliminarProveedor,
cambiarEstadoProveedor
} = require('../controllers/proveedores.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', obtenerProveedores);
router.get('/activos', obtenerProveedoresActivos );
router.get('/:id', obtenerProveedorPorId);
router.post('/', crearProveedor);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);
router.put('/estado/:id', cambiarEstadoProveedor);

module.exports = router;
