const { Novedades } = require('../models');


exports.crearNovedades = async (req, res) => {
  try {
    const nuevoNovedades = await Novedades.create(req.body);
    return res.status(201).json({ status: 'success', data: nuevoNovedades });
  } catch (err) {
    const errorMsg = err.name === 'SequelizeUniqueConstraintError'
      ? 'La Novedades ya existe'
      : err.message;
    return res.status(400).json({ status: 'error', message: errorMsg });
  }
};

exports.listarNovedades = async (_req, res) => {
  try {
    const novedades = await Novedades.findAll();
    return res.json({ status: 'success', data: novedades });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarNovedades = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Novedades.update(req.body, { where: { id } });

    if (!actualizados) {
      return res.status(404).json({ status: 'error', message: 'Novedad no encontrada' });
    }

    return res.json({ status: 'success', message: 'Novedad actualizado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarNovedades = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Novedades.destroy({ where: { id } });

    if (!eliminados) {
      return res.status(404).json({ status: 'error', message: 'Novedad no encontrado' });
    }

    return res.json({ status: 'success', message: 'Novedad eliminado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
