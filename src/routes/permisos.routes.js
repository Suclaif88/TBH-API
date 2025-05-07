const { Router } = require('express');
const {
    crearPermiso,
    listarPermisos,
    listarPermisoId,
    actualizarPermiso,
    eliminarPermiso
} = require('../controllers/Permisos.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarPermisos);
router.get('/:id', listarPermisoId);
router.post('/', crearPermiso);
router.put('/:id', actualizarPermiso);
router.delete('/:id', eliminarPermiso);

module.exports = router;
