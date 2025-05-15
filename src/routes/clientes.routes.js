const { Router } = require('express');
const {
  crearCliente,
  listarCliente,
  listarClientePorId,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/cliente.controller');

const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/', listarCliente);
router.get('/:id_cliente', listarClientePorId)
router.post('/', crearCliente);
router.put('/:id_cliente', actualizarCliente);
router.delete('/:id_cliente', eliminarCliente);

module.exports = router;