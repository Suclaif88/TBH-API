const { Servicios } = require('../models');


exports.crearServicios = async (req, res) => {
  try {
    const nuevoServicios = await Servicios.create(req.body);
    return res.status(201).json({ status: 'success', data: nuevoServicios });
  } catch (err) {
    const errorMsg = err.name === 'SequelizeUniqueConstraintError'
      ? 'El nombre del servicio ya existe'
      : err.message;
    return res.status(400).json({ status: 'error', message: errorMsg });
  }
};

exports.listarServicios = async (_req, res) => {
  try {
    const servicios = await Servicios.findAll();
    return res.json({ status: 'success', data: servicios });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarServicios = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Servicios.update(req.body, { where: { id } });

    if (!actualizados) {
      return res.status(404).json({ status: 'error', message: 'Servicio no encontrada' });
    }

    return res.json({ status: 'success', message: 'Servicio actualizado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarServicios = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Servicios.destroy({ where: { id } });

    if (!eliminados) {
      return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }

    return res.json({ status: 'success', message: 'Servicio eliminado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
