const { Router } = require('express');
const {
  crearUsuario,
  listarUsuario,
  listarUsuarioPorId,
  listarUsuarioPorDocumento,
  buscarUsuarioPorEmail,
  actualizarUsuario,
  eliminarUsuario,
  cambiarEstadoUsuario
} = require('../controllers/usuario.controller');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Usuarios'));


router.get('/', listarUsuario);
router.get('/id/:id', listarUsuarioPorId)
router.get('/documento/:documento', listarUsuarioPorDocumento)
router.get('/email/:email', buscarUsuarioPorEmail)
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.put('/estado/:id', cambiarEstadoUsuario)

module.exports = router;
