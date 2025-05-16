const { Producto_Imagen, Imagenes } = require('../models');

// POST: Asociar una imagen a un producto
exports.agregarImagenProducto = async (req, res) => {
  const { Id_Productos, Id_Imagenes } = req.body;

  try {
    const asociacion = await Producto_Imagen.create({
      Id_Productos,
      Id_Imagenes
    });

    res.status(201).json({
      mensaje: 'Imagen asociada correctamente al producto.',
      data: asociacion
    });
  } catch (error) {
    console.error('Error al asociar imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// GET: Obtener imágenes por ID de producto
exports.obtenerImagenesPorProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const asociaciones = await Producto_Imagen.findAll({
      where: { Id_Productos: id },
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

