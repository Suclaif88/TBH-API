const { Router } = require("express");
const {
  crearServicio,
  obtenerServicios,
  obtenerServiciosActivos,
  obtenerServicioById,
  actualizarServicio,
  cambiarEstadoServicio,
  eliminarServicio,
} = require("../controllers/servicios.controller");

const upload = require("../middleware/upload");
const verificarToken = require("../middleware/authMiddleware");
const autorizar = require("../middleware/checkPermission");

const router = Router();

// 🚀 Ruta pública: servicios activos
router.get("/activos", obtenerServiciosActivos);

// 🚀 Rutas protegidas (admin)
router.use(verificarToken);
router.use(autorizar("Servicios"));

router.post("/", upload.array("imagenes"), crearServicio);
router.get("/", obtenerServicios);
router.get("/:id", obtenerServicioById);
router.put("/:id", actualizarServicio);
router.put("/estado/:id", cambiarEstadoServicio);
router.delete("/:id", eliminarServicio);

module.exports = router;
