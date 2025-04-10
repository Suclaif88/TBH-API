const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");
const { Imagenes } = require('../models');


const subirMultiplesImagenes = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 'error', message: "No se enviaron imágenes" });
    }

    const resultados = [];

    for (const file of req.files) {
      const tempFilePath = path.join(__dirname, `../../temp-${Date.now()}.webp`);
      fs.writeFileSync(tempFilePath, file.buffer);

      const resultado = await cloudinary.uploader.upload(tempFilePath, {
        folder: "productos",
        format: "webp"
      });

      fs.unlinkSync(tempFilePath);

      const nuevaImagen = await Imagenes.create({
        URL: resultado.secure_url
      });

      resultados.push({
        id: nuevaImagen.Id_Imagenes,
        url: nuevaImagen.URL
      });
    }

    res.json({
      status: 'success',
      imagenes: resultados
    });

  } catch (error) {
    console.error("Error al subir imágenes:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { subirMultiplesImagenes };
