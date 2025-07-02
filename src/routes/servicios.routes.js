const {Router} = require ('express');
const {
    crearServicio,
    listarServicio,
    obtenerServicioById,
    actualizarServicio,
    cambiarEstadoServicio,
    eliminarServicio    
} = require ('../controllers/servicios.controller');
const upload = require("../middleware/upload");
const verificarToken =require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Servicios'));


router.post('/', upload.array('imagenes'), crearServicio);
router.get('/', listarServicio)
router.get('/:id', obtenerServicioById)
router.put('/:id', actualizarServicio)
router.put('/estado/:id', cambiarEstadoServicio);
router.delete('/:id', eliminarServicio)


module.exports = router;
