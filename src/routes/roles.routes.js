const { Router } = require('express');
const {
  crearRoles,
  listarRoles,
  listarRolesId,
  actualizarRoles,
  eliminarRoles
} = require('../controllers/roles.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarRoles);
router.get('/:id', listarRolesId);
router.post('/', crearRoles);
router.put('/:id', actualizarRoles);
router.delete('/:id', eliminarRoles);

module.exports = router;
