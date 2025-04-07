const { Router } = require('express');
const {
  crearRoles,
  listarRoles,
  actualizarRoles,
  eliminarRoles
} = require('../controllers/roles.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarRoles);
router.post('/', crearRoles);
router.put('/:id', actualizarRoles);
router.delete('/:id', eliminarRoles);

module.exports = router;
