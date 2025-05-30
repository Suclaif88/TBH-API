const { Servicios } = require('../models');

exports.crearServicio = async (req, res) => {
    try {
        const nuevoServicio = await Servicios.create(req.body);
        res.json({ status: 'success', data: nuevoServicio});
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message});
    }
};

exports.listarServicio = async (req, res) => {
    try {
        const servicio = await Servicios.findAll();
        res.json({ status: 'succes', data: servicio });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message});
    }
};

exports.obtenerServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicios.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: 'servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

exports.actualizarServicio = async (req, res) => {
try {
    const { id } = req.params;
    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });
    if (!servicio) {
    return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }
    await servicio.update(req.body, { where: { Id_Servicios: id } });
    res.json({ status: 'success', message: 'servicio actualizado' });
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
}
};


exports.eliminarServicio = async (req, res) => {
try {
    const { id } = req.params;
    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });
    if (!servicio) {
    return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }
    await servicio.destroy({ where: { Id_Servicios: id } });
    res.json({ status: 'success', message: 'Servicio eliminado' });
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
}
};

// Cambia el estado de un Servicio (activar o desactivar)
exports.cambiarEstadoServicio = async (req, res) => {
  try {
    const id = req.params.id;

    const servicio = await Servicios.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }

    servicio.Estado = !servicio.Estado;
    await servicio.save();

    res.json({
      status: 'success',
      mensaje: `servicio ${servicio.Estado ? 'activado' : 'desactivado'} correctamente`,
      servicio
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};




