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
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Compras'));

router.post("/", crearCompra);
router.get("/", obtenerCompras);
router.get("/:id", obtenerCompraPorId);
router.get("/detalles/:id", obtenerCompraConDetalles);
router.put("/estado/:id", cambiarEstadoCompra);

module.exports = router;