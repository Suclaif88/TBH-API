const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { subirMultiplesImagenes, eliminarMultiplesImagenes } = require("../controllers/imagenes.controller");
const verificarToken = require('../middleware/authMiddleware');

router.use(verificarToken);
router.post("/upload", upload.array("imagenes", 5), subirMultiplesImagenes);
router.delete('/delete', eliminarMultiplesImagenes);


module.exports = router;
