const { Router } = require('express');
const {
    listarEmpleados, 
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
} = require('../controllers/empleados.controller.js');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);

router.get('/', listarEmpleados);
router.get('/:documento', obtenerEmpleadoPorId);
router.post('/', crearEmpleado);
router.put('/:documento', actualizarEmpleado);
router.delete('/:documento', eliminarEmpleado);

module.exports = router;
