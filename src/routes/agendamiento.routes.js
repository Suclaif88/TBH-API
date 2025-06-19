const {Router} = require ('express');
const {
    crearAgendamientos,
    listarAgendamiento,
    obtenerAgendamientosPorId,
    eliminarAgendamientos    
} = require ('../controllers/agendamiento.controller');
const verificarToken =require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Agendamiento'));

router.post('/', crearAgendamientos)
router.get('/', listarAgendamiento)
router.put('/:id', obtenerAgendamientosPorId)
router.delete('/:id', eliminarAgendamientos)


module.exports = router;
