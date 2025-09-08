const { Router } = require('express');
const {
    crearEmpleado,
    obtenerEmpleadosActivos,
    listarEmpleados, 
    obtenerEmpleadoPorId, 
    actualizarEmpleado,
    eliminarEmpleado,
    cambiarEstadoEmpleado,
    listarEmpleadoPorDocumento,
    obtenerServiciosDeEmpleado
} = require('../controllers/empleados.controller.js');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Empleados'));

router.post('/', crearEmpleado);
router.get('/activos', obtenerEmpleadosActivos);
router.get('/', listarEmpleados);
router.get('/documento/:documento', listarEmpleadoPorDocumento);
router.get('/:id', obtenerEmpleadoPorId);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);
router.put('/estado/:id', cambiarEstadoEmpleado);

router.get("/:id/servicios", obtenerServiciosDeEmpleado);

module.exports = router;
