const { Router } = require('express');
const {
    crearRolPermiso,
    listarRolPermisos,
    listarRolPermisoId,
    actualizarRolPermiso,
    eliminarRolPermiso,
    listarPermisosPorRol,
    cambiarEstadoRolPermiso
} = require('../controllers/asignacionPermisos.controller');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);

router.get('/rol/:rolId', listarPermisosPorRol);

router.use(autorizar('Roles'));


router.get('/', listarRolPermisos);
router.get('/:id', listarRolPermisoId);
router.post('/', crearRolPermiso);
router.put('/:id', actualizarRolPermiso);
router.delete('/:id', eliminarRolPermiso);
router.put('/estado/:id', cambiarEstadoRolPermiso)

module.exports = router;
