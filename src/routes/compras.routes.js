const { Router } = require('express');
const {
crearCompra,
obtenerCompras,
obtenerCompraPorId,
obtenerCompraConDetalles,
cambiarEstadoCompra,
crearDetalles
} = require('../controllers/compras.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.post("/", crearCompra);
router.post("/detalles-compra", crearDetalles);
router.get("/", obtenerCompras);
router.get("/:id", obtenerCompraPorId);
router.get("/detalles/:id", obtenerCompraConDetalles);
router.put("/estado/:id", cambiarEstadoCompra);

module.exports = router;