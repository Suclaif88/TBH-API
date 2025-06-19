const { Router } = require('express');
const {
  crearVenta,
  listarVentas,
  actualizarVenta,
  eliminarVenta
} = require('../controllers/ventas.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Ventas'));


router.get('/', listarVentas);
router.post('/', crearVenta);
router.put('/:id', actualizarVenta);
router.delete('/:id', eliminarVenta);

module.exports = router;
