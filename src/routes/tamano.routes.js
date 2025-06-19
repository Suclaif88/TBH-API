const { Router } = require('express');
const {
obtenerTamanos,
obtenerTamanoPorId,
obtenerTamanosActivos,
crearTamano,
actualizarTamano,
eliminarTamano,
cambiarEstadoTamano,
crearRelacionTamañoInsumos
} = require('../controllers/tamano.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Productos'));


router.get('/', obtenerTamanos);
router.get('/activos', obtenerTamanosActivos);
router.get('/:id', obtenerTamanoPorId);
router.post('/', crearTamano);
router.post('/relaciones', crearRelacionTamañoInsumos);
router.put('/:id', actualizarTamano);
router.delete('/:id', eliminarTamano);
router.put('/estado/:id', cambiarEstadoTamano);

module.exports = router;
