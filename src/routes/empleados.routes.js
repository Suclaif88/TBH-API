const { Router } = require('express');
const {
    crearEmpleado,
    obtenerEmpleadosActivos,
    obtenerEmpleadosActivosPublico,
    obtenerServiciosEmpleado,
    listarEmpleados, 
    obtenerEmpleadoPorId, 
    actualizarEmpleado,
    eliminarEmpleado,
    cambiarEstadoEmpleado,
    listarEmpleadoPorDocumento
} = require('../controllers/empleados.controller.js');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

// Rutas protegidas solo por token - no requieren verificación de roles
router.get('/publico/activos', verificarToken, obtenerEmpleadosActivosPublico);
router.get('/publico/:id/servicios', verificarToken, obtenerServiciosEmpleado);

// Rutas protegidas - requieren autenticación y autorización
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

router.get("/:id/servicios", obtenerServiciosEmpleado);

module.exports = router;
