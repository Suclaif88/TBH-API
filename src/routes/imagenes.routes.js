// src/routes/imagenes.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { subirMultiplesImagenes } = require("../controllers/imagenes.controller");

router.post("/imagenes", upload.array("imagenes", 5), subirMultiplesImagenes);

module.exports = router;
