const { Router } = require('express');
const {
    ListarServiciosEmpleados,
    ServiciosEmpleadosId 
} = require('../controllers/detalledevolucione.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);
router.get('/',ListarServiciosEmpleados);      
router.post('/', ServiciosEmpleadosId);


module.exports = router;
