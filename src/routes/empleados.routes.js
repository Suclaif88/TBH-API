const { Router } = require('express');
const {
    crearEmpleado,
    listarEmpleados, 
    obtenerEmpleadoPorId, 
    actualizarEmpleado,
    eliminarEmpleado,
} = require('../controllers/empleados.controller.js');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);

router.post('/', crearEmpleado);
router.get('/', listarEmpleados);
router.get('/:documento', obtenerEmpleadoPorId);
router.put('/:documento', actualizarEmpleado);
router.delete('/:documento', eliminarEmpleado);

module.exports = router;
