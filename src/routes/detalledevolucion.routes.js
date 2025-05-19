const {Router} = require ('express')
const {
    listadetalleDevolucion,
    obtenerdetallesDevolucionporId
} = require ('../controllers/detalledevolucion.controller.js');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();
router.use(verificarToken);
router.get('/', listadetalleDevolucion);
router.get('/:id', obtenerdetallesDevolucionporId);

module.exports = router;
