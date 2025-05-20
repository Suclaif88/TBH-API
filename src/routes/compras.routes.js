const { Router } = require('express');
const {
crearCompra,
obtenerCompras,
obtenerCompraPorId,
cambiarEstadoCompra
} = require('../controllers/compras.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.post("/", crearCompra);
router.get("/", obtenerCompras);
router.get("/:id", obtenerCompraPorId);
router.put("/estado/:id", cambiarEstadoCompra);

module.exports = router;