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

router.get('/', verificarAdmin, listarEmpleados);      
router.post('/', verificarAdmin, crearEmpleado);       
router.get('/:documento', obtenerEmpleadoPorId);       
router.put('/:documento', verificarAdmin, actualizarEmpleado);         
router.delete('/:documento', verificarAdmin, eliminarEmpleado); 

module.exports = router;
