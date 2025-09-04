const { Router } = require('express');
const {
  crearCliente,
  listarClientes,
  listarClientePorId,
  listarClientePorDocumento,
  buscarClientePorEmail,
  actualizarCliente,
  eliminarCliente,
  cambiarEstadoCliente,
  crearClienteCL
} = require('../controllers/cliente.controller');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.get('/documento/:documento', listarClientePorDocumento);
router.post('/', crearClienteCL);
router.put('/:id', actualizarCliente);

router.use(verificarToken);
router.use(autorizar('Clientes'));

router.post('/', crearCliente);
router.get('/', listarClientes);
router.get('/id/:id', listarClientePorId);  
router.get('/email/:email', buscarClientePorEmail);
router.delete('/:id', eliminarCliente);
router.put('/estado/:id', cambiarEstadoCliente);

module.exports = router;
