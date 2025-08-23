const { Servicio_Imagen, Imagenes } = require('../models');

// POST: Asociar una imagen a un Servicio
exports.agregarImagenServicio = async (req, res) => {
  const { Id_Servicios, Id_Imagenes } = req.body;

  try {
    const asociacion = await Servicio_Imagen.create({
      Id_Servicios,
      Id_Imagenes
    });

    res.status(201).json({
      mensaje: 'Imagen asociada correctamente al Servicio.',
      data: asociacion
    });
  } catch (error) {
    console.error('Error al asociar imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// GET: Obtener imágenes por ID de producto
exports.obtenerImagenesPorServicio = async (req, res) => {
  const { id } = req.params;

  try {
    const asociaciones = await Producto_Imagen.findAll({
      where: { Id_Servicios: id },
      include: {
        model: Imagenes,
        as: 'Id_Imagenes_Imagene', // <--- usa el alias que definiste
        attributes: ['Id_Imagenes', 'URL']
      }
    });

    // Usa el mismo alias para acceder a las imágenes
    const imagenes = asociaciones.map(a => a.Id_Imagenes_Imagene);

    res.status(200).json(imagenes);
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
