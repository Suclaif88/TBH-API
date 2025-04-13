const { Router } = require('express');
const {
  crearUsuario,
  listarUsuario,
  listarUsuarioPorDocumento,
  buscarUsuarioPorEmail,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuario.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarUsuario);
router.get('/:documento', listarUsuarioPorDocumento)
router.get('/email/:email', buscarUsuarioPorEmail)
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
