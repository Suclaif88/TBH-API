// src/middleware/upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // Guarda los archivos en memoria como buffer
const upload = multer({ storage });

module.exports = upload;
