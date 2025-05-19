const {Router} = require('express')
const{
    ListarServiciosEmpleados,
    ServiciosEmpleadosId
} = require('../controllers/empleadoservicio.controller.js');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);

router.get('/', ListarServiciosEmpleados);
router.get('/:id', ServiciosEmpleadosId);

module.exports = router;
