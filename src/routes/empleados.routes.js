const { Router } = require('express');
const {
    crearEmpleado,
    listarEmpleados, 
    obtenerEmpleadoPorDocumento,
    actualizarEmpleado,
    eliminarEmpleado,
} = require('../controllers/empleados.controller.js');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);

router.post('/', crearEmpleado);
router.get('/', listarEmpleados);
router.get('/:documento', obtenerEmpleadoPorDocumento);
router.put('/:documento', actualizarEmpleado);
router.delete('/:documento', eliminarEmpleado);

module.exports = router;
