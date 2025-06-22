const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");
const { Imagenes, Producto_Imagen } = require('../models');


async function subirImagenesDesdeArchivos(files) {
  const resultados = [];

  for (const file of files) {
    const tempFilePath = path.join(__dirname, `../../temp-${Date.now()}.webp`);
    fs.writeFileSync(tempFilePath, file.buffer);

    const resultado = await cloudinary.uploader.upload(tempFilePath, {
      folder: "imagenes",
      format: "webp",
      quality: "auto:best",
    });

    fs.unlinkSync(tempFilePath);

    const nuevaImagen = await Imagenes.create({
      URL: resultado.secure_url
    });

    resultados.push({
      Id_Imagenes: nuevaImagen.Id_Imagenes,
      URL: nuevaImagen.URL
    });
  }

  return resultados;
}


async function eliminarImagenesPorIdsArray(ids) {
  const resultados = [];

  for (const id of ids) {
    const imagen = await Imagenes.findByPk(id);

    if (imagen) {
      const urlParts = imagen.URL.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const publicId = `imagenes/${fileName.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
      await imagen.destroy();
      await Producto_Imagen.destroy({ where: { Id_Imagenes: id } });

      resultados.push({ id, status: 'eliminado' });
    } else {
      resultados.push({ id, status: 'no encontrada' });
    }
  }

  return resultados;
}

module.exports = { subirImagenesDesdeArchivos, eliminarImagenesPorIdsArray  };