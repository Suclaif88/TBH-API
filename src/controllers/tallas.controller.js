const { Tallas } = require('../models');


// Obtener todas las Tallas 
exports.obtenerTallas = async (req, res) => {
  try {
    const tallas = await Tallas.findAll();
    res.json(tallas);
  } catch (error) {
    res.status(500).json({ error: 'Error al Obtener las Tallas' });
  }
};


// Obtener una Talla por ID
exports.obtenerTallaPorId = async (req, res) => {
  try {
    const talla = await Tallas.findByPk(req.params.id);
    if (talla) {
      res.json(talla);
    } else {
      res.status(404).json({ error: 'Talla no Encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al Obtener la Talla' });
  }
};

// Crear nueva Talla
exports.crearTalla = async (req, res) => {
  try {
    const nuevaTalla = await Tallas.create(req.body);
    res.status(201).json(nuevaTalla);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error al crear la Talla', detalles: error });
  }
};

// Actualizar una Talla
exports.actualizarTalla = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Tallas.update(req.body, {
      where: { Id_Tallas: id }
    });

    if (updated) {
      const tallaActualizada = await Tallas.findByPk(id);
      res.json(tallaActualizada);
    } else {
      res.status(404).json({ error: 'Talla no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al Actualizar Talla', detalles: error });
  }
};

// Eliminar una Talla
exports.eliminarTalla = async (req, res) => {
  try {
    const id = req.params.id;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({ error: 'Talla no Encontrada' });
    }

    await talla.destroy();
    res.json({ mensaje: 'Talla Eliminada Permanentemente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al Eliminar la Talla' });
  }
};

// Cambiar el estado de una talla (activar o desactivar)
exports.cambiarEstadoTalla = async (req, res) => {
  try {
    const id = req.params.id;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({ error: 'Talla no Encontrada' });
    }

    talla.Estado = !talla.Estado;
    await talla.save();

    res.json({
      mensaje: `Talla ${talla.Estado ? 'activada' : 'desactivada'} correctamente`,
      talla
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al Cambiar el Estado de la Talla' });
  }
};

