const {Router} = require ('express');
const {
    crearServicio,
    listarServicio,
    obtenerServicioById,
    actualizarServicio,
    eliminarServicio    
} = require ('../controllers/servicios.controller');
const verificarToken =require('../middleware/authMiddleware');

const router = Router ();

router.use(verificarToken);

router.post('/', crearServicio)
router.get('/', listarServicio)
router.get('/:id', obtenerServicioById)
router.put('/:id', actualizarServicio)
router.delete('/:id', eliminarServicio)


module.exports = router;
