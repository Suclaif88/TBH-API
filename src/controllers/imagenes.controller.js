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
        folder: "imagenes",
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

const eliminarMultiplesImagenes = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Debes enviar un array de IDs' });
  }

  if (ids.length > 5) {
    return res.status(400).json({
      status: 'error',
      message: 'Solo puedes eliminar hasta 5 imágenes por solicitud'
    });
  }

  try {
    const resultados = [];

    for (const id of ids) {
      const imagen = await Imagenes.findByPk(id);

      if (imagen) {
        const urlParts = imagen.URL.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `imagenes/${fileName.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
        await imagen.destroy();

        resultados.push({ id, status: 'eliminado' });
      } else {
        resultados.push({ id, status: 'no encontrada' });
      }
    }

    res.json({
      status: 'success',
      resultados
    });

  } catch (error) {
    console.error('Error al eliminar múltiples imágenes:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { subirMultiplesImagenes, eliminarMultiplesImagenes };