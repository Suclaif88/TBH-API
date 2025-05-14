const { Router } = require('express');
const {
  crearCliente,
  listarCliente,
  listarClienteDocumento,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/cliente.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarCliente);
router.get('/:documento', listarClienteDocumento)
router.post('/', crearCliente);
router.put('/:documento_cliente', actualizarCliente);
router.delete('/:documento_cliente', eliminarCliente);

module.exports = router;