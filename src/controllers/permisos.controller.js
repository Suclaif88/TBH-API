const { Permisos } = require('../models');

exports.crearPermiso = async (req, res) => {
  try {
    const nuevo = await Permisos.create(req.body);
    res.json({ status: 'success', data: nuevo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarPermisos = async (req, res) => {
  try {
    const lista = await Permisos.findAll();
    res.json({ status: 'success', data: lista });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarPermisoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Permisos.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Permiso no encontrado' });
    }

    res.json({ status: 'success', data: item });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Permisos.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Permiso no encontrado' });
    }

    await Permisos.update(req.body, { where: { id } });
    res.json({ status: 'success', message: 'Permiso actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Permisos.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Permiso no encontrado' });
    }

    await Permisos.destroy({ where: { id } });
    res.json({ status: 'success', message: 'Permiso eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
