const { Router } = require('express');
const {
    crearRolPermiso,
    listarRolPermisos,
    listarRolPermisoId,
    actualizarRolPermiso,
    eliminarRolPermiso,
    listarPermisosPorRol
} = require('../controllers/asignacionPermisos.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarRolPermisos);
router.get('/:id', listarRolPermisoId);
router.get('/rol/:rolId', listarPermisosPorRol);
router.post('/', crearRolPermiso);
router.put('/:id', actualizarRolPermiso);
router.delete('/:id', eliminarRolPermiso);

module.exports = router;
