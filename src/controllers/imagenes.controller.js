// src/controllers/imagenesController.js
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");
const { Imagenes } = require('../models');


const subirMultiplesImagenes = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ exito: false, error: "No se enviaron imágenes" });
    }

    const resultados = [];

    for (const file of req.files) {
      // Crear archivo temporal
      const tempFilePath = path.join(__dirname, `../../temp-${Date.now()}.webp`);
      fs.writeFileSync(tempFilePath, file.buffer);

      // Subir a Cloudinary
      const resultado = await cloudinary.uploader.upload(tempFilePath, {
        folder: "productos",
        format: "webp"
      });

      // Eliminar archivo temporal
      fs.unlinkSync(tempFilePath);

      // Guardar en base de datos
      const nuevaImagen = await Imagenes.create({
        URL: resultado.secure_url
      });

      resultados.push({
        id: nuevaImagen.Id_Imagenes,
        url: nuevaImagen.URL
      });
    }

    res.json({
      exito: true,
      mensaje: "Imágenes subidas correctamente",
      imagenes: resultados
    });

  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(500).json({ exito: false, error: error.message });
  }
};

module.exports = { subirMultiplesImagenes };
