const { Router } = require('express');
const {
  crearEmpleadoServicio,
  listarEmpleadoServicios,
  obtenerEmpleadoServicioPorId,
  actualizarEmpleadoServicio,
  eliminarEmpleadoServicio,
} = require('../controllers/empleadoServicio.controller.js');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);

router.post('/', crearEmpleadoServicio);
router.get('/', listarEmpleadoServicios);
router.get('/:id', obtenerEmpleadoServicioPorId);
router.put('/:id', actualizarEmpleadoServicio);
router.delete('/:id', eliminarEmpleadoServicio);

module.exports = router;
