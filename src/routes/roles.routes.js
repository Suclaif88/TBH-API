const { Router } = require('express');
const {
  crearRoles,
  listarRoles,
  listarRolesId,
  actualizarRoles,
  eliminarRoles,
  cambiarEstadoRoles
} = require('../controllers/roles.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarRoles);
router.get('/:id', listarRolesId);
router.post('/', crearRoles);
router.put('/:id', actualizarRoles);
router.delete('/:id', eliminarRoles);
router.put('/estado/:id', cambiarEstadoRoles);

module.exports = router;
