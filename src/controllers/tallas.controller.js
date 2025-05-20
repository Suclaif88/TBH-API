const { Tallas } = require('../models');


// Obtener todas las Tallas 
exports.obtenerTallas = async (req, res) => {
  try {
    const tallas = await Tallas.findAll();
    res.json({ status: 'success', data: tallas });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// Obtener una Talla por ID
exports.obtenerTallaPorId = async (req, res) => {
  try {
    const talla = await Tallas.findByPk(req.params.id);
    if (talla) {
      res.json({ status: 'success', data: talla });
    } else {
      res.status(404).json({ status: 'error', message: 'Talla no Encontrada' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Crear nueva Talla
exports.crearTalla = async (req, res) => {
  try {
    const nuevaTalla = await Tallas.create(req.body);
    res.json({ status: 'success', data: nuevaTalla });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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
      res.json({ status: 'success', data: tallaActualizada });
    } else {
      res.status(404).json({ status: 'error', message: 'Talla no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Eliminar una Talla
exports.eliminarTalla = async (req, res) => {
  try {
    const id = req.params.id;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({ status: 'error', message: 'Talla no Encontrada' });
    }

    await talla.destroy();
    res.json({ status: 'Succes', mensaje: 'Talla Eliminada Permanentemente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Cambiar el estado de una talla (activar o desactivar)
exports.cambiarEstadoTalla = async (req, res) => {
  try {
    const id = req.params.id;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({ status: 'error', message: 'Talla no Encontrada' });
    }

    talla.Estado = !talla.Estado;
    await talla.save();

    res.json({
      status: 'success',
      mensaje: `Talla ${talla.Estado ? 'activada' : 'desactivada'} correctamente`,
      talla
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

