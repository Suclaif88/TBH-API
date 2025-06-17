const { Router } = require('express');
const {
  crearCliente,
  listarClientes,
  listarClientePorId,
  listarClientePorDocumento,
  buscarClientePorEmail,
  actualizarCliente,
  eliminarCliente,
  cambiarEstadoCliente
} = require('../controllers/cliente.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarClientes);
router.get('/id/:id', listarClientePorId);
router.get('/documento/:documento', listarClientePorDocumento);
router.get('/email/:email', buscarClientePorEmail);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);
router.put('/estado/:id', cambiarEstadoCliente);

module.exports = router;
