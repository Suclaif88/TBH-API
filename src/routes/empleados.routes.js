const { Router } = require('express');
const {
    crearEmpleado,
    obtenerEmpleadosActivos,
    listarEmpleados, 
    obtenerEmpleadoPorId, 
    actualizarEmpleado,
    eliminarEmpleado,
    cambiarEstadoEmpleado,
} = require('../controllers/empleados.controller.js');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Empleados'));

router.post('/', crearEmpleado);
router.get('/activos', obtenerEmpleadosActivos);
router.get('/', listarEmpleados);
router.get('/:id', obtenerEmpleadoPorId);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);
router.put('/estado/:id', cambiarEstadoEmpleado);
module.exports = router;
