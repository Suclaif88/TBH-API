const {Router} = require ('express');
const {
    crearNovedades,
    listarNovedades,
    obtenerNovedadesPorId,
    eliminarNovedades    
} = require ('../controllers/novedades_horarios.controllers');
const verificarToken =require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Novedades'));

router.post('/', crearNovedades)
router.get('/', listarNovedades)
router.put('/:id', obtenerNovedadesPorId)
router.delete('/:id', eliminarNovedades)


module.exports = router;
