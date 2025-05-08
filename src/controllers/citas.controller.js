const { Citas } = require('../models');


exports.crearCitas = async (req, res) => {
  try {
    const nuevoCita = await Roles.create(req.body);
    return res.status(201).json({ status: 'success', data: nuevoCita });
  } catch (err) {
    const errorMsg = err.name === 'SequelizeUniqueConstraintError'
      ? 'El nombre de la cita ya existe'
      : err.message;
    return res.status(400).json({ status: 'error', message: errorMsg });
  }
};


exports.listarCitas = async (_req, res) => {
  try {
    const citas = await Citas.findAll();
    return res.json({ status: 'success', data: citas });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarCitas = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Citas.update(req.body, { where: { id } });

    if (!actualizados) {
      return res.status(404).json({ status: 'error', message: 'Cita no encontrada' });
    }

    return res.json({ status: 'success', message: 'Cita actualizado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarCitas = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Citas.destroy({ where: { id } });

    if (!eliminados) {
      return res.status(404).json({ status: 'error', message: 'Cita no encontrado' });
    }

    return res.json({ status: 'success', message: 'Citas eliminado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
