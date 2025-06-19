const { Router } = require('express');
const {
    crearPermiso,
    listarPermisos,
    listarPermisoId,
    actualizarPermiso,
    eliminarPermiso
} = require('../controllers/permisos.controller');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Roles'));


router.get('/', listarPermisos);
router.get('/:id', listarPermisoId);
router.post('/', crearPermiso);
router.put('/:id', actualizarPermiso);
router.delete('/:id', eliminarPermiso);

module.exports = router;
