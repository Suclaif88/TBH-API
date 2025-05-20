const { Router } = require('express');
const {
    ListarDetalleDevoluciones,
    obtenerdetallesDevolucionporId    
} = require('../controllers/detalledevolucione.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);
router.get('/',ListarDetalleDevoluciones);      
router.post('/', obtenerdetallesDevolucionporId );


module.exports = router;
