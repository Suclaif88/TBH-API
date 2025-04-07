const { Router } = require('express');
const {
  crearUsuario,
  listarUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuario.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarUsuario);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
