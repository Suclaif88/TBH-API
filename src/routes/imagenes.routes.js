const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { subirMultiplesImagenes } = require("../controllers/imagenes.controller");
const verificarToken = require('../middleware/authMiddleware');

router.use(verificarToken);
router.post("/img", upload.array("imagenes", 5), subirMultiplesImagenes);

module.exports = router;
