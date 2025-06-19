const { Router } = require('express');
const {
  obtenerTallas,
  obtenerTallaPorId,
  crearTalla,
  actualizarTalla,
  eliminarTalla,
  cambiarEstadoTalla
} = require('../controllers/tallas.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Productos'));


router.get('/', obtenerTallas);
router.get('/:id', obtenerTallaPorId);
router.post('/', crearTalla);
router.put('/:id', actualizarTalla);
router.delete('/:id', eliminarTalla);
router.put('/estado/:id', cambiarEstadoTalla);

module.exports = router;
